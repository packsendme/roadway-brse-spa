import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LocationModel } from 'app/model/location-model';
import { TransportTypeModel } from 'app/model/transport-type-model';
import { CategoryService } from 'app/service/category.service';
import { ConfirmationDialogService } from 'app/service/confirmation-dialog.service';
import { LocationService } from 'app/service/location.service';
import { TransportTypeService } from 'app/service/transport-type.service';
import { ToastrService } from 'ngx-toastr';
import { CategoryModel } from 'app/model/category-model';
import { CostsModel } from 'app/model/costs-model';
import { RoadwaybreService } from 'app/service/roadwaybre.service';
import { RoadwaybreModel } from 'app/model/roadwaybre-model';
import * as moment from 'moment';
import { StatusModel } from 'app/model/status-model.enum';

@Component({
  selector: 'app-businessrule-new',
  templateUrl: './businessrule-new.component.html',
  styleUrls: ['./businessrule-new.component.css']
})
export class BusinessruleNewComponent implements OnInit {

 // List Another Requests
 categories: CategoryModel[];
 locations: LocationModel[];
 transporties: TransportTypeModel[];

 // Screen Option
 statusDelete_btn = true;
 statusEditNew_btn = true;
 isShow = false;
 isEdit = false;
 editdisabled = true;
 viewButton = false;

 // New Object - Entity
 transportNew_Obj: TransportTypeModel;
 countryNew_Vet: LocationModel[] = [];
 countryNew_Obj: LocationModel;
 categoriesNew_Vet: CategoryModel[] = [];
 categoryNew_Obj: CategoryModel;
 dateCreationNew_Obj: String;
 dateChangeNew_Obj: String;
 nameBRENew_Obj: String;
 statusNew: String;
 versionNew: String;
 transportOld: String;

 // Costs Table
 costsBRE_DS: CostsModel[] = [];
 clonedCosts: { [s: string]: CostsModel; } = {};

  constructor(
    private roadwayBREService: RoadwaybreService,
    private categoryService: CategoryService,
    private locationService: LocationService,
    private toastr: ToastrService,
    private router: Router,
    private transportService: TransportTypeService,
    private confirmationDialogService: ConfirmationDialogService) {}

  ngOnInit(): void {
    this.nameBRENew_Obj = 'BRE-';
    this.versionNew = '1.0';
    this.statusNew = StatusModel.Registered;
    this.findLocations();
    this.findTransporties();
  }

// ------------------------------------------------------------------------//
// REQUESTs - EXTERNAL
// ------------------------------------------------------------------------//

  findCategoriesByTransport() {
    let categoriesVet: CategoryModel [] = [];
    this.categoryService.getCategoryByTransport(this.transportNew_Obj.name_transport).subscribe((categoryData: Response) => {
      const categoryDataStr = JSON.stringify(categoryData.body);
      JSON.parse(categoryDataStr, function (key, value) {
        if (key === 'categories') {
          categoriesVet = value;
          return value;
        } else {
          return value;
        }
      });
      this.categories = categoriesVet;
      if (this.transportOld !== this.transportNew_Obj.name_transport) {
        this.updateFieldByChangeCategory();
        this.transportOld = this.transportNew_Obj.name_transport;
      }

    });
  }

  findLocations() {
    let locationsVet: LocationModel[] = [];
    this.locationService.getLocation().subscribe((locationsData: Response) =>{
      const locationsStr = JSON.stringify(locationsData.body);
      JSON.parse(locationsStr, function (key, value){
        if (key === 'locations') {
          locationsVet = value;
          return value;
        } else {
          return value;
        }
      });
      this.locations = locationsVet;
    });
  }

  findTransporties() {
    let transportiesVet: TransportTypeModel [] = [];
    this.transportService.getTransportType().subscribe((transportTypeData: Response) => {
      const transportTypeDataStr = JSON.stringify(transportTypeData.body);
      JSON.parse(transportTypeDataStr, function (key, value) {
        if (key === 'transporties') {
          transportiesVet = value;
          return value;
        } else {
           return value;
        }
      });
      this.transporties = transportiesVet;
    });
  }

// ------------------------------------------------------------------------//
// OPERATION TRANSACTION - CRUD
// ------------------------------------------------------------------------//

  newRecord(event: any) {
    event.resetForm(event);
    this.countryNew_Vet = [];
    this.statusEditNew_btn = true;
    this.statusDelete_btn = true;
    this.costsBRE_DS = [];
    this.clonedCosts = {};
    this.isShow = false;
  }

  prepareSave(event: any) {
    const categoryCostsArray: CostsModel[] = [];
    let statusChange = false;
    let msg: string;

    this.costsBRE_DS.forEach( (catCosts) => {
      if ( catCosts.statusChange === false ) {
        statusChange = true;
      }
    });

    if ( statusChange === false ) {
      msg = 'Do you include a new category?';
    } else {
      msg = 'There are costs in the cost table that have a default value of 0.00. Do you still want to save the category?';
    }

    this.confirmationDialogService.confirm('Save', msg)
    .then((result) => {
      if ( result === true ) {
        const roadwayBRE_Entity: RoadwaybreModel = {
          id: null,
          name_bre: this.nameBRENew_Obj,
          transport: this.transportNew_Obj.name_transport,
          date_creation: new Date(),
          date_change: null,
          status: this.statusNew,
          version: this.versionNew,
          categories: this.categoriesNew_Vet,
          locations: this.countryNew_Vet,
          costs: this.costsBRE_DS,
        }
        this.saveRoadwayBRE(event, roadwayBRE_Entity);
      }
    })
    .catch(() => console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'));
  }

  saveRoadwayBRE(event: any,  roadatBRE: RoadwaybreModel) {
    this.roadwayBREService.postRoadwayBRE(roadatBRE).subscribe({
      next: data => this.transactionOrchestrator(event, 'Save'),
      error: error => this.showNotification('bottom', 'center', error, 'error')
    });
  }

// ------------------------------------------------------------------------//
// OPERATION ::   Transaction Field Value
// ------------------------------------------------------------------------//

  // UPDATE TABLE BY CHANGE CATEGORY  ---------------------//
  onChangeNameBRE() {
    this.nameBRENew_Obj = 'BRE-' + this.categoryNew_Obj.name_category + '-' + this.transportNew_Obj.name_transport;
  }


  // UPDATE TABLE BY CHANGE CATEGORY  ---------------------//
  updateFieldByChangeCategory() {
    this.categoriesNew_Vet = [];
   // this.categoryNew_Obj = null;
    this.costsBRE_DS = [];
  }

  // FIELD COUNTRY ---------------------//
  addCountry() {
    let statusCountry = false;
    if (this.countryNew_Vet.length >= 1) {
      this.countryNew_Vet.forEach( (countryObj) => {
      if (countryObj.countryName === this.countryNew_Obj.countryName) {
        statusCountry = true;
      }
    })
  }

  if ( statusCountry === false ) {
    console.log('countryNew_Obj', this.countryNew_Obj);
    this.countryNew_Vet.push(this.countryNew_Obj);
    if ( this.costsBRE_DS.length > 0 ) {
      this.generateCostsTable_AddCountry(this.countryNew_Obj.countryName);
    }
  } else {
    this.transactionOrchestrator(null, 'ValidationII');
  }

  }

  removeCountry(countryEditSelect: LocationModel) {
    console.log(' removeCountry() ');
    const error = 'It is not possible to delete a single country that is registered';
    let costsDS_Local: CostsModel[] = [];
    costsDS_Local = this.costsBRE_DS;

    if (this.countryNew_Vet.length > 1) {
      const countryObj = this.countryNew_Vet.findIndex(country => country.countryName === countryEditSelect.countryName);
      this.countryNew_Vet.splice(countryObj, 1);

      if (this.costsBRE_DS.length >= 1){
        this.costsBRE_DS.forEach(function (countryCosts) {
            // tslint:disable-next-line:max-line-length
            const countryCostsObj = costsDS_Local.findIndex(costsCountry => costsCountry.countryName === countryEditSelect.countryName);
            costsDS_Local.splice(countryCostsObj, 1);
        })
      }
      this.costsBRE_DS = costsDS_Local;
    } else if ( this.countryNew_Vet.length === 1) {
      this.showNotification('bottom', 'center', error, 'error')
    }
  }

  // FIELD CATEGORY ---------------------//
  addCategory() {
    let statusCategory = false;
    if (this.categoriesNew_Vet != null) {
      if (this.categoriesNew_Vet.length >= 1) {
        this.categoriesNew_Vet.forEach( (categoryObj) => {
          if (categoryObj.name_category === this.categoryNew_Obj.name_category) {
            statusCategory = true;
          }
        })
      }
    }

    if ( statusCategory === false ) {
      console.log('categoryNew_Obj', this.categoryNew_Obj);
      this.categoriesNew_Vet.push(this.categoryNew_Obj);
      if ( this.costsBRE_DS.length > 0 ) {
        this.generateCostsTable_AddVehicle(this.categoryNew_Obj);
      }
    } else {
      this.transactionOrchestrator(null, 'ValidationII');
    }
  }

  removeCategory(categoryEditSelect: CategoryModel) {
    console.log(' removeCategory() ');
    const error = 'It is not possible to delete a single category that is registered';
    let costsDS_Local: CostsModel[] = [];
    costsDS_Local = this.costsBRE_DS;
    const categoriesNew_Vet_L = this.categoriesNew_Vet;

    if (this.categoriesNew_Vet.length > 1) {
      const categoryObj = this.categoriesNew_Vet.findIndex(category => category.name_category === categoryEditSelect.name_category);
      this.categoriesNew_Vet.splice(categoryObj, 1);

      if (this.costsBRE_DS.length >= 1) {
        categoriesNew_Vet_L.forEach(function (categoryObj) {
          categoryObj.vehicles.forEach(function(vehicleObj) {
            costsDS_Local.forEach(function (costsObj) {
              if ( vehicleObj.vehicle_type === costsObj.vehicle) {
                const categoryObjExclude = costsDS_Local.findIndex(category => category.vehicle === costsObj.vehicle);
                costsDS_Local.splice(categoryObjExclude, 1);
              }
            })
          })
        })
        this.costsBRE_DS = costsDS_Local;
      }
    } else if ( this.categoriesNew_Vet.length === 1) {
        this.showNotification('bottom','center', error, 'error')
    }
  }

//------------------------------------------------------------------------//
// OPERATION UPDATE ::  COSTS TABLES
//------------------------------------------------------------------------//

prepareCostsTable(event: any) {
  console.log('generateCostsTable size countryNew_Vet ', this.countryNew_Vet.length);

  if (( this.countryNew_Vet.length === 0)  && (this.categoriesNew_Vet.length === 0 )) {
    console.log('generateCostsTable - transactionOrchestrator ');
    this.transactionOrchestrator(event, 'Validation');
  } else {
      this.generateFirstCostsTable(event);
  }
}

generateFirstCostsTable(event: any) {
  const valueCosts = '0.00';
  let categoryCostsObj: CostsModel;
  this.isShow = true;
  this.statusEditNew_btn = false;
  const locations = this.countryNew_Vet;
  const categories = this.categoriesNew_Vet;

  const categoryCosts: CostsModel[] = [];
  let countryS: string = null;
  let countryOld: string = null;
  let countrySame = true;

  locations.forEach(function (location) {
    countryS = location.countryName;
    categories.forEach(function (category) {
      category.vehicles.forEach(function (vehicle) {
        if ( countryS === countryOld) {
          countrySame = false;
        } else {
          countrySame = true;
        }
        categoryCostsObj = {
          vehicle: vehicle.vehicle_type, countryName: countryS,
          weight_cost: valueCosts, distance_cost: valueCosts,
          worktime_cost: valueCosts, average_consumption_cost: valueCosts,
          rate_exchange: valueCosts, current_exchange: valueCosts,
          countryNew: countrySame, statusChange: false
        };
        // Add Object geneate to Array
        categoryCosts.push(categoryCostsObj);
        countryOld = countryS;

      })
    })
  })
  this.costsBRE_DS = categoryCosts;
}

generateCostsTable_AddCountry(countryNameS: string) {
  const valueCosts = '0.00';
  let costsBRE_L: CostsModel[] = [];
  let costsObj: CostsModel;
  let statusNewCountry = false;
  const categories = this.categoriesNew_Vet;
  let index = 0;
  costsBRE_L = this.costsBRE_DS;

  categories.forEach(function (category) {
    category.vehicles.forEach(function (vehicle) {

      if (index === 0) {
        statusNewCountry = true;
      } else {
        statusNewCountry = false;
      }
      costsObj = {
        vehicle: vehicle.vehicle_type, countryName: countryNameS,
        weight_cost: valueCosts, distance_cost: valueCosts,
        worktime_cost: valueCosts, average_consumption_cost: valueCosts,
        rate_exchange: valueCosts, current_exchange: valueCosts,
        countryNew: statusNewCountry, statusChange: false
      };
      costsBRE_L.push(costsObj);
      index++;
    })
  })
  this.costsBRE_DS = costsBRE_L;
}

generateCostsTable_AddVehicle(categoryObj: CategoryModel) {
  const valueCosts = '0.00';
  let costsBRE_L: CostsModel[] = [];
  let categoryCostsObj: CostsModel;
  const countries = this.countryNew_Vet;
  const categories = this.countryNew_Vet;
  costsBRE_L = this.costsBRE_DS;

  countries.forEach(function (country) {
    categoryObj.vehicles.forEach(function (vehicle) {
      categoryCostsObj = {
        vehicle: vehicle.vehicle_type, countryName: country.countryName,
        weight_cost: valueCosts, distance_cost: valueCosts,
        worktime_cost: valueCosts, average_consumption_cost: valueCosts,
        rate_exchange: valueCosts, current_exchange: valueCosts,
        countryNew: false, statusChange: false
      };
      costsBRE_L.push(categoryCostsObj);
    })
  })
  this.costsBRE_DS = costsBRE_L;
}

//------------------------------------------------------------------------//
// OPERATION NOTIFICATION ::
//------------------------------------------------------------------------//

transactionOrchestrator(event: any, type: String) {
  let msgTransaction = '' as  String;
  switch (type) {
    case 'Save': {
      msgTransaction = 'Register Success';
      type = 'success';
      event.resetForm(event);
      this.functionRedirectToRoadwayBREView();
      break;
    }
    case 'Validation': {
      msgTransaction = 'Check the required fields';
      type = 'error';
      console.log('Validation');
      break;
    }
    case 'ValidationII': {
      msgTransaction = 'The selected field is already added';
      type = 'error';
      console.log('Validation');
      break;
    }
    default: {
      break;
   }
  }
  this.showNotification('bottom', 'center', msgTransaction, type)
}

showNotification(from, align, msg, type) {
  const color = Math.floor(Math.random() * 5 + 1);
  switch (type) {
    case 'success':
      this.toastr.success(
        '<span data-notify="icon" class="nc-icon nc-bell-55"></span><span data-notify="message">'+ msg +'</span>','', {
          timeOut: 4000,
          closeButton: true,
          enableHtml: true,
          toastClass: 'alert alert-success alert-with-icon',
          positionClass: 'toast-' + from + '-' + align
        }
      );
    break;
    case 'error':
      this.toastr.error(
        '<span data-notify="icon" class="nc-icon nc-bell-55"></span><span data-notify="message">'+ msg +'</span>','', {
          timeOut: 4000,
          enableHtml: true,
          closeButton: true,
          toastClass: 'alert alert-danger alert-with-icon',
          positionClass: 'toast-' + from + '-' + align
        }
      );
    break;
    default:
    break;
  }
}

//------------------------------------------------------------------------//
// OPERATION REDIRECT ::
//------------------------------------------------------------------------//

functionRedirectToRoadwayBREView() {
  this.router.navigate(['/businessrule-view']);
}

functionRedirectToLocation() {
  this.router.navigate(['/location']);
}

functionRedirectToCategories() {
  this.router.navigate(['/categories']);
}

functionRedirectToTransport() {
  this.router.navigate(['/transport']);
}


//------------------------------------------------------------------------//
// OPERATION CRUD :: COSTS TABLE
//------------------------------------------------------------------------//

onRowEditInit(costsObj: CostsModel) {
  this.clonedCosts[costsObj.vehicle] = {...costsObj};
}
onRowEditSave(costs: CostsModel) {
  costs.statusChange = true;
}
onRowEditCancel(costs: CostsModel, index: number) {
  this.costsBRE_DS[index] = this.clonedCosts[costs.vehicle];
}
validateNumber(e: any) {
  const input = String.fromCharCode(e.charCode);
  const reg = /^\d*\.?\d{0,2}$/g;
  if (!reg.test(input)) {
    e.preventDefault();
  }
}

}
