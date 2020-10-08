import { Location } from '@angular/common';
import { CategoryCostsModel } from '../../model/category-costs-model';
import { LocationModel } from '../../model/location-model';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { CategoryTypeModel } from 'app/model/category-type-model';
import { VehicleModel } from 'app/model/vehicle-model';
import { CategoryTypeService } from 'app/service/category-type.service';
import { LocationService } from 'app/service/location.service';
import { VehicleService } from 'app/service/vehicle.service';
import { ToastrService } from 'ngx-toastr';
import { CategoryRuleModel } from 'app/model/category-rule-model';
import { CategoryService } from 'app/service/category.service';
import { NgForm } from '@angular/forms';
import { CategoryData } from 'app/model/categoryData';
import { ConfirmationDialogService } from 'app/service/confirmation-dialog.service';



@Component({
  selector: 'app-category',
  templateUrl: './categorynew.component.html',
  styleUrls: ['./categorynew.component.css']
})
export class CategorynewComponent implements OnInit {

  // List Another Requests
  categories: CategoryRuleModel[];
  categoriesTypes: CategoryTypeModel[];
  vehicles: VehicleModel[];
  locations: LocationModel[];

  // Screen Option
  statusDelete_btn = true;
  statusEditNew_btn = true;
  isShow = false;
  isEdit = false;
  editdisabled = true;
  viewButton = false;

  // New Object - Entity
  categoryTypeNew_Obj = {} as CategoryTypeModel;
  countryNew_Vet: LocationModel[] = [];
  countryNew_Obj = {} as LocationModel;
  vehicleNew_Vet: VehicleModel[] = [];
  vehicleNew_Obj = {} as VehicleModel;

  // Costs Table
  categoryCostsDS: CategoryCostsModel[] = [];
  clonedCosts: { [s: string]: CategoryCostsModel; } = {};

  constructor(
    private categoryData: CategoryData,
    private categoryService: CategoryService,
    private categoryTypeService: CategoryTypeService,
    private locationService: LocationService,
    private vehicleService: VehicleService,
    private toastr: ToastrService,
    private router: Router,
    private confirmationDialogService: ConfirmationDialogService) {

    }

  ngOnInit(): void {
    this.findCategoriesType();
    this.findVehicles();
    this.findLocations();
    this.findCategories();

  }

  //--------- REQUESTs - EXTERNAL ---------------------------------------//

  findCategories() {
    let categoriesVet: CategoryRuleModel [] = [];
    this.categoryService.getCategory().subscribe((categoryData: Response) => {
      const categoryDataStr = JSON.stringify(categoryData.body);
      JSON.parse(categoryDataStr, function (key, value) {
        if (key === 'categoryL') {
          categoriesVet = value;
          return value;
        } else {
           return value;
        }
      });
      this.categories = categoriesVet;
    });
  }

  findCategoriesType() {
    let categoriesVet: CategoryTypeModel [] = [];
    this.categoryTypeService.getCategoryType().subscribe((categoryTypeData: Response) => {
      const categoryTypeDataStr = JSON.stringify(categoryTypeData.body);
      JSON.parse(categoryTypeDataStr, function (key, value) {
        if (key === 'categoriesType') {
          categoriesVet = value;
          return value;
        } else {
           return value;
        }
      });
      this.categoriesTypes = categoriesVet;
    });
  }

  findVehicles() {
    let vehicleVet: VehicleModel[] = [];
    this.vehicleService.getVehicle().subscribe((vehicleData: Response) => {
      const vehicleStr = JSON.stringify(vehicleData.body);
      JSON.parse(vehicleStr, function (key, value) {
        if (key === 'vehiclesL') {
          vehicleVet = value;
          return value;
        } else {
          return value;
        }
      });
      this.vehicles = vehicleVet;
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


  // --------- OPERATION TRANSACTION - CRUD ---------------------------------------//

  newRecord(event: any) {
    event.resetForm(event);
    this.countryNew_Vet = [];
    this.countryNew_Obj = {} as LocationModel;
    this.vehicleNew_Vet = [];
    this.vehicleNew_Obj = {} as VehicleModel;
    this.statusEditNew_btn = true;
    this.statusDelete_btn = true;
    this.categoryCostsDS = [];
    this.clonedCosts = {};
    this.isShow = false;
  }

  prepareSave(event: any) {
    const categoryCostsArray: CategoryCostsModel[] = [];
    let statusChange = false;
    let msg: string;

    this.categoryCostsDS.forEach( (catCosts) => {
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
        const categoryRuleEntity: CategoryRuleModel = {
          id: null,
          categoryType: this.categoryTypeNew_Obj,
          vehicles: this.vehicleNew_Vet,
          locations: this.countryNew_Vet,
          categoryCosts: this.categoryCostsDS
        }
        this.saveCategory(event, categoryRuleEntity);
        this.functionRedirectToCategories();
      }
    })
    .catch(() => console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'));
  }

  saveCategory(event: any,  categoryRuleEntity: CategoryRuleModel) {
    this.categoryService.postCategory(categoryRuleEntity).subscribe({
      next: data => this.transactionOrchestrator(event, 'Save'),
      error: error => this.showNotification('bottom', 'center', error, 'error')
    });
  }



//------------------------------------------------------------------------//
// OPERATION ::   Transaction Field Value
//------------------------------------------------------------------------//

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
    if ( this.categoryCostsDS.length > 0 ) {
      this.generateCostsTable_AddCountry(this.countryNew_Obj.countryName);
    }
  } else {
    this.transactionOrchestrator(null, 'ValidationII');
  }

}

removeCountry(countryEditSelect: LocationModel) {
  console.log(' removeCountry() ');
  const error = 'It is not possible to delete a single country that is registered';
  let categoryCostsDS_Local: CategoryCostsModel[] = [];
  categoryCostsDS_Local = this.categoryCostsDS;

  if (this.countryNew_Vet.length > 1) {
    const countryObj = this.countryNew_Vet.findIndex(country => country.countryName === countryEditSelect.countryName);
    this.countryNew_Vet.splice(countryObj, 1);

    if (this.categoryCostsDS.length >= 1){
      this.categoryCostsDS.forEach(function (countryCosts) {
          // tslint:disable-next-line:max-line-length
          const countryCostsObj = categoryCostsDS_Local.findIndex(costsCountry => costsCountry.countryName === countryEditSelect.countryName);
          categoryCostsDS_Local.splice(countryCostsObj, 1);
      })
    }
    this.categoryCostsDS = categoryCostsDS_Local;
    console.log(' countryCosts ', this.categoryCostsDS);

  } else if ( this.countryNew_Vet.length === 1) {
    this.showNotification('bottom','center', error, 'error')
  }
}

// FIELD VEHICLE ---------------------//
removeVehicle(vehicleEditSelect: VehicleModel) {
  console.log(' removeVehicle() ', vehicleEditSelect);
  const error = 'It is not possible to delete a single vehicle that is registered';
  let categoryCostsDS_Local: CategoryCostsModel[] = [];
  categoryCostsDS_Local = this.categoryCostsDS;

  if ( this.vehicleNew_Vet.length > 1) {
    const vehicleObj = this.vehicleNew_Vet.findIndex(vehicle => vehicle.vehicle_type === vehicleEditSelect.vehicle_type);
    this.vehicleNew_Vet.splice(vehicleObj, 1);

    if (this.categoryCostsDS.length >= 1 ) {
      this.categoryCostsDS.forEach(function (vehicleCosts) {
          const vehicleCostsObj = categoryCostsDS_Local.findIndex(vehicles => vehicles.vehicle === vehicleEditSelect.vehicle_type);
          console.log(' removeVehicle() vehicleCostsObj ',  vehicleCostsObj);
          if (vehicleCostsObj !== -1) {
            categoryCostsDS_Local.splice(vehicleCostsObj, 1);
            console.log(' removeVehicle() costs ',  categoryCostsDS_Local);
          }
      })
    }
    this.categoryCostsDS = categoryCostsDS_Local;
    console.log(' countryCosts ', this.categoryCostsDS);

  } else if ( this.vehicleNew_Vet.length === 1) {
    this.showNotification('bottom','center', error, 'error')
  }
}

addVehicle() {
  let statusVehicle = false;
  if ( this.vehicleNew_Vet.length >= 1) {
    this.vehicleNew_Vet.forEach( (vehicleObj) => {
      if (vehicleObj.vehicle_type === this.vehicleNew_Obj.vehicle_type) {
        statusVehicle = true;
      }
    })
  }

  if ( statusVehicle === false ) {
    this.vehicleNew_Vet.push(this.vehicleNew_Obj);
    if (this.categoryCostsDS.length > 0 ) {
      this.generateCostsTable_AddVehicle(this.vehicleNew_Obj.vehicle_type);
    }
  } else {
    this.transactionOrchestrator(null, 'ValidationII');
  }
}

//------------------------------------------------------------------------//
// OPERATION ::   Transaction COSTS TABLES
//------------------------------------------------------------------------//

  prepareCostsTable(event: any) {
    console.log('generateCostsTable size countryNew_Vet ', this.countryNew_Vet.length);
    console.log('generateCostsTable size vehicleNew_Vet ', this.vehicleNew_Vet.length);
    console.log('generateCostsTable size categoryCostsDS ',  this.categoryCostsDS.length);

    if (( this.countryNew_Vet.length === 0)  && (this.vehicleNew_Vet.length === 0 )) {
      console.log('generateCostsTable - transactionOrchestrator ');
      this.transactionOrchestrator(event, 'Validation');
    } else {
        this.generateFirstCostsTable(event);
    }
  }

  generateFirstCostsTable(event: any) {
    const valueCosts = '0.00';
    let categoryCostsObj: CategoryCostsModel;
    this.isShow = true;
    this.statusEditNew_btn = false;
    const locations = this.countryNew_Vet;
    const vehiclies = this.vehicleNew_Vet;
    const categoryCosts: CategoryCostsModel[] = [];
    const locationsCosts: String[] = [];
    let countryS: string = null;
    let countryOld: string = null;
    let countrySame = true;

    locations.forEach(function (value1) {
      locationsCosts.push(value1.countryName);
      countryS = value1.countryName;
      vehiclies.forEach(function (value) {
        if ( countryS === countryOld) {
          countrySame = false;
        } else {
          countrySame = true;
        }

        categoryCostsObj = {
          vehicle: value.vehicle_type, countryName: countryS,
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
    this.categoryCostsDS = categoryCosts;
  }

  generateCostsTable_AddCountry(countryNameS: string) {
    const valueCosts = '0.00';
    let categoryCosts_L: CategoryCostsModel[] = [];
    let categoryCostsObj: CategoryCostsModel;
    let statusNewCountry = false;
    const vehiclies = this.vehicleNew_Vet;
    let index = 0;
    categoryCosts_L = this.categoryCostsDS;

    vehiclies.forEach(function (vehicle) {
      if (index === 0) {
        statusNewCountry = true;
      } else {
        statusNewCountry = false;
      }
      categoryCostsObj = {
        vehicle: vehicle.vehicle_type, countryName: countryNameS,
        weight_cost: valueCosts, distance_cost: valueCosts,
        worktime_cost: valueCosts, average_consumption_cost: valueCosts,
        rate_exchange: valueCosts, current_exchange: valueCosts,
        countryNew: statusNewCountry, statusChange: false
      };
      categoryCosts_L.push(categoryCostsObj);
      index++;
    })
    this.categoryCostsDS = categoryCosts_L;
  }

  generateCostsTable_AddVehicle(vehicleS: string) {
    const valueCosts = '0.00';
    let categoryCosts_L: CategoryCostsModel[] = [];
    let categoryCostsObj: CategoryCostsModel;
    const countries = this.countryNew_Vet;
    categoryCosts_L = this.categoryCostsDS;

    countries.forEach(function (country) {
      categoryCostsObj = {
        vehicle: vehicleS, countryName: country.countryName,
        weight_cost: valueCosts, distance_cost: valueCosts,
        worktime_cost: valueCosts, average_consumption_cost: valueCosts,
        rate_exchange: valueCosts, current_exchange: valueCosts,
        countryNew: false, statusChange: false
      };
      categoryCosts_L.push(categoryCostsObj);
    })
    this.categoryCostsDS = categoryCosts_L;
  }


// --------------------------------------------------------------------------------//

selectCategory(event: any, categorySelect: any) {
  this.statusDelete_btn = false;
  this.statusEditNew_btn = false;
}

transactionOrchestrator(event: any, type: String) {
  let msgTransaction = '' as  String;
  switch (type) {
    case 'Save': {
      msgTransaction = 'Register Success';
      type = 'success';
      this.findCategories()
      event.resetForm(event);
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

handleClear(f: NgForm) {
   f.resetForm();
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

functionRedirectToCategoryType() {
  this.router.navigate(['/categorytype']);
}

functionRedirectToVehicle() {
  this.router.navigate(['/vehicle']);
}

functionRedirectToLocation() {
  this.router.navigate(['/vehicle']);
}

functionRedirectToCategories() {
  this.router.navigate(['/categories']);
}



// Costs Operation CRUD Table ----------------------------------------------------------------------//

onRowEditInit(costsObj: CategoryCostsModel) {
  this.clonedCosts[costsObj.vehicle] = {...costsObj};
}
onRowEditSave(costs: CategoryCostsModel) {
  costs.statusChange = true;
}
onRowEditCancel(costs: CategoryCostsModel, index: number) {
  this.categoryCostsDS[index] = this.clonedCosts[costs.vehicle];
}
validateNumber(e: any) {
  const input = String.fromCharCode(e.charCode);
  const reg = /^\d*\.?\d{0,2}$/g;
  if (!reg.test(input)) {
    e.preventDefault();
  }
}

}
