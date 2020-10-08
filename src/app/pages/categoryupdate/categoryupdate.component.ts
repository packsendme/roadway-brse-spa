import { ConfirmationDialogService } from './../../service/confirmation-dialog.service';
import { Location } from '@angular/common';
import { CategoryCostsModel } from './../../model/category-costs-model';
import { LocationModel } from './../../model/location-model';
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

@Component({
  selector: 'app-categoryupdate',
  templateUrl: './categoryupdate.component.html',
  styleUrls: ['./categoryupdate.component.css']
})
export class CategoryupdateComponent implements OnInit {

  // List Another Requests
  categories: CategoryRuleModel[];
  categoriesTypes: CategoryTypeModel[];
  vehicles: VehicleModel[];
  locations: LocationModel[];

  // Screen Option
  categoryOne_Obj = {} as CategoryRuleModel;
  categoryCostsOne = {} as CategoryCostsModel;
  countrySelCosts = {} as string;
  statusDelete_btn = true;
  statusEditNew_btn = true;
  isShow = false;
  isEdit = false;
  editdisabled = true;
  viewButton = false;

  // Model Costs to HTML
  categoryCostsDS: CategoryCostsModel[] = [];
  categoryCostsIIDS: CategoryCostsModel[] = [];
  clonedCosts: { [s: string]: CategoryCostsModel; } = {};

  // Edit Object - Entity
  categoryEdit_Obj = {} as CategoryRuleModel;
  countryEdit_Obj = {} as LocationModel;
  vehicleEdit_Obj = {} as VehicleModel;
  locationCosts: String[] = [];

  constructor(
    private categoryData: CategoryData,
    private categoryService: CategoryService,
    private categoryTypeService: CategoryTypeService,
    private locationService: LocationService,
    private vehicleService: VehicleService,
    private toastr: ToastrService,
    private router: Router,
    private confirmationDialogService: ConfirmationDialogService) {
      if ( this.categoryData.categoryruleData != null ) {
        console.log( ' NOT NULL ', this.categoryData.categoryruleData );
        this.categoryOne_Obj = this.categoryData.categoryruleData;
        this.isEdit = true;
      }
      else{
        this.categoryOne_Obj = {} as CategoryRuleModel;
      }
    }

  ngOnInit(): void {
    this.findCategoriesType();
    this.findVehicles();
    this.findLocations();
    this.generateCostsTable();
  }

//------------------------------------------------------------------------//
// OPERATION ::  REQUESTs - EXTERNAL
//------------------------------------------------------------------------//

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
  this.locationService.getLocation().subscribe((locationsData: Response) => {
    const locationsStr = JSON.stringify(locationsData.body);
    JSON.parse(locationsStr, function (key, value) {
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

//------------------------------------------------------------------------//
// OPERATION ::  TRANSACTION - CRUD
//------------------------------------------------------------------------//

  prepareUpdate(event: any) {
    const categoryCostsArray: CategoryCostsModel[] = [];
    let statusChange = false;
    let msgUpdate: string;

    this.categoryCostsDS.forEach( (catCosts) => {
      if ( catCosts.statusChange === false ) {
        statusChange = true;
      }
    });

    if ( statusChange === false ) {
      msgUpdate = 'Do you confirm the change of the registered category data?';
    } else {
      msgUpdate = 'There are costs in the cost table that have a default value of 0.00. Do you still want to save the category?';
    }

    this.confirmationDialogService.confirm('Update', msgUpdate)
    .then((result) => {
      if ( result === true ) {
        this.categoryOne_Obj.locations.forEach( (location) => {
          this.categoryCostsDS.forEach( (catCosts) => {
            if ( location.countryName === catCosts.countryName ) {
              categoryCostsArray.push(catCosts);
            }
          });
        });
        const categoryRuleEntity: CategoryRuleModel = {
          id: this.categoryOne_Obj.id,
          categoryType: this.categoryOne_Obj.categoryType,
          vehicles: this.categoryOne_Obj.vehicles,
          locations: this.categoryOne_Obj.locations,
          categoryCosts: categoryCostsArray
        }
        this.updateCategory(event, categoryRuleEntity);
      }
    })
    .catch(() => console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'));
  }

  updateCategory(event: any,  categoryRuleEntity: CategoryRuleModel){
    this.categoryService.putCategory(categoryRuleEntity).subscribe({
      next: data => this.transactionOrchestrator(event, 'Update'),
      error: error => this.showNotification('bottom', 'center', error, 'error')
    });
  }

  prepareDelete(event: any) {
    this.confirmationDialogService.confirm('Delete', 'Do you confirm the delete of category data?')
    .then((result) => {
      if ( result === true ) {
        this.deleteCategory(event);
      }
    })
    .catch(() => console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'));

  }

  deleteCategory(event: any) {
    console.log(' deleteVehicle ');
    this.statusDelete_btn = true;
    this.statusEditNew_btn = true;
    // Transaction Delete
    if (this.categoryOne_Obj.id != null) {
      this.categoryService.deleteCategory(this.categoryOne_Obj).subscribe({
        next: data => this.transactionOrchestrator(event, 'Delete'),
        error: error => this.showNotification('bottom', 'center', error, 'error')
      });
    }
  }

// --------------------------------------------------------------------------------//

selectCategory(event: any, categorySelect: any) {
  this.statusDelete_btn = false;
  this.statusEditNew_btn = false;
  this.categoryOne_Obj = categorySelect;
}

//------------------------------------------------------------------------//
// OPERATION ::  NOTIFICATION
//------------------------------------------------------------------------//


transactionOrchestrator(event: any, type: String) {
  console.log(' transactionOrchestrator ', type);
  let msgTransaction = '' as  String;
  switch (type) {
    case 'Update': {
      msgTransaction = 'Update Success';
      type = 'success';
      console.log('Update Success');
      this.functionRedirectToCategories();
      break;
    }
    case 'Delete': {
      msgTransaction = 'Delete Success';
      type = 'success';
      this.functionRedirectToCategories();
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
  console.log(' showNotification  type ', type);
  console.log(' showNotification  msg ', msg);
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
// OPERATION ::   Transaction Field Value
//------------------------------------------------------------------------//

// FIELD CATEGORY ---------------------//
addCategory() {
  this.categoryOne_Obj.categoryType = this.categoryEdit_Obj.categoryType;
}

// FIELD COUNTRY ---------------------//

removeCountry(countryEditSelect: LocationModel) {
  console.log(' removeCountry() ');
  const error = 'It is not possible to delete a single country that is registered';
  let categoryCostsDS_Local: CategoryCostsModel[] = [];
  categoryCostsDS_Local = this.categoryCostsDS;

  if ( this.categoryOne_Obj.locations.length > 1) {
    const countryObj = this.categoryOne_Obj.locations.findIndex(country => country.countryName === countryEditSelect.countryName);
    this.categoryOne_Obj.locations.splice(countryObj, 1);

    this.categoryCostsDS.forEach(function (countryCosts) {
        const countryCostsObj = categoryCostsDS_Local.findIndex(costsCountry => costsCountry.countryName === countryEditSelect.countryName);
        categoryCostsDS_Local.splice(countryCostsObj, 1);
    })
    this.categoryCostsDS = categoryCostsDS_Local;
    this.countrySelCosts = null;
    console.log(' countryCosts ', this.categoryCostsDS);
    this.onChangeCountry(null);

  } else if ( this.categoryOne_Obj.locations.length === 1) {
    this.showNotification('bottom','center', error, 'error')
  }
}

addCountry() {
  let statusCountry = false;

  this.categoryOne_Obj.locations.forEach( (countryObj) => {
    if (countryObj.countryName === this.countryEdit_Obj.countryName) {
      statusCountry = true;
    }
  })

  if ( statusCountry === false ) {
    this.categoryOne_Obj.locations.push(this.countryEdit_Obj);
  } else {
    this.transactionOrchestrator(null, 'ValidationII');
  }

}

// FIELD VEHICLE ---------------------//
removeVehicle(vehicleEditSelect: VehicleModel) {
  console.log(' removeVehicle() ', vehicleEditSelect);
  const error = 'It is not possible to delete a single vehicle that is registered';
  let categoryCostsDS_Local: CategoryCostsModel[] = [];
  categoryCostsDS_Local = this.categoryCostsDS;

  if ( this.categoryOne_Obj.vehicles.length > 1) {
    const vehicleObj = this.categoryOne_Obj.vehicles.findIndex(vehicle => vehicle.vehicle_type === vehicleEditSelect.vehicle_type);
    this.categoryOne_Obj.vehicles.splice(vehicleObj, 1);
    console.log(' removeVehicle() vehicles ',  this.categoryOne_Obj.vehicles);

    this.categoryCostsDS.forEach(function (vehicleCosts) {
        const vehicleCostsObj = categoryCostsDS_Local.findIndex(vehicles => vehicles.vehicle === vehicleEditSelect.vehicle_type);
        console.log(' removeVehicle() vehicleCostsObj ',  vehicleCostsObj);
        if (vehicleCostsObj !== -1) {
          categoryCostsDS_Local.splice(vehicleCostsObj, 1);
          console.log(' removeVehicle() costs ',  categoryCostsDS_Local);
        }
    })
    this.categoryCostsDS = categoryCostsDS_Local;
    this.countrySelCosts = null;
    console.log(' countryCosts ', this.categoryCostsDS);
    this.onChangeCountry(null);

  } else if ( this.categoryOne_Obj.vehicles.length === 1) {
    this.showNotification('bottom','center', error, 'error')
  }
}
addVehicle() {
  let statusVehicle = false;

  this.categoryOne_Obj.vehicles.forEach( (vehicleObj) => {
    if (vehicleObj.vehicle_type === this.vehicleEdit_Obj.vehicle_type) {
      statusVehicle = true;
    }
  })

  if ( statusVehicle === false ) {
    this.categoryOne_Obj.vehicles.push(this.vehicleEdit_Obj);
    this.generateCostsTable();
    this.onChangeCountry(null);
  } else {
    this.transactionOrchestrator(null, 'ValidationII');
  }
}

//------------------------------------------------------------------------//
// OPERATION TABLE - COSTS BY COUNTRY
//------------------------------------------------------------------------//

generateCostsTable() {
  if (( this.categoryOne_Obj.locations == null ) || ( this.categoryOne_Obj.vehicles.length  == null )) {
    console.log('generateCostsTable - transactionOrchestrator ');
    this.transactionOrchestrator(event, 'Validation');
  } else {
    const valueCosts = '0.00';
    let categoryCostsObj: CategoryCostsModel;
    this.isShow = true;
    this.statusEditNew_btn = false;
    const locations = this.categoryOne_Obj.locations;
    const vehiclies = this.categoryOne_Obj.vehicles;
    const costsV = this.categoryOne_Obj.categoryCosts;

    const categoryCosts: CategoryCostsModel[] = [];
    const categoryCostsExclude: CategoryCostsModel[] = [];
    const locationsCosts: String[] = [];
    let countryS: string = null;
    let statusAddVet = false;

    locations.forEach(function (locationObj) {
      locationsCosts.push(locationObj.countryName);
      countryS = locationObj.countryName;
       vehiclies.forEach(function (vehicle) {
        statusAddVet = false;
        costsV.forEach(function (costs) {
          if ((vehicle.vehicle_type === costs.vehicle) && (locationObj.countryName === costs.countryName)) {
            console.log(' Entrou Costs ');
            categoryCostsObj = {
              vehicle: costs.vehicle, countryName: countryS,
              weight_cost: costs.weight_cost, distance_cost: costs.distance_cost,
              worktime_cost: costs.worktime_cost, average_consumption_cost: costs.average_consumption_cost,
              rate_exchange: costs.rate_exchange, current_exchange: costs.current_exchange,
              countryNew: false, statusChange: costs.statusChange};
            categoryCosts.push(categoryCostsObj);
            statusAddVet = true;
          }
        })
        if ( statusAddVet === false) {
          categoryCostsObj = {
            vehicle: vehicle.vehicle_type, countryName: countryS,
            weight_cost: valueCosts, distance_cost: valueCosts,
            worktime_cost: valueCosts, average_consumption_cost: valueCosts,
            rate_exchange: valueCosts, current_exchange: valueCosts,
            countryNew: false, statusChange: false};
          categoryCosts.push(categoryCostsObj);
        }
      })
    })
    this.categoryCostsDS = categoryCosts;
    this.locationCosts = locationsCosts;
  }
}


findCountryByCosts(countrySelect: string) {
  console.log(' findCountryByCosts ', countrySelect);
  const categoryCostsL: CategoryCostsModel[] = [];
  this.categoryCostsDS.forEach(function (costsDB) {
    if (costsDB.countryName === countrySelect) {
      categoryCostsL.push(costsDB);
    }
  })
  this.categoryCostsIIDS = categoryCostsL;
  console.log(' Result findCountryByCosts  ', this.categoryCostsIIDS);

}

viewCountryCosts(event: any) {
  const countryCostsSelect = this.countrySelCosts;
  console.log(' viewCountryCosts ', countryCostsSelect);

  const categoryCostsL: CategoryCostsModel[] = [];
  if (countryCostsSelect !== null) {
    const categoryCostsDS2 = this.categoryCostsDS.find( x => x.countryName === this.countrySelCosts) || null;
    if (categoryCostsDS2 !== null) {
      console.log(' viewCountryCosts NOT NULL ', categoryCostsDS2);
      this.findCountryByCosts(countryCostsSelect);
    } else {
      this.generateCostsTable();
      this.findCountryByCosts(countryCostsSelect);
    }
  }
}

onChangeCountry(event: any) {
  this.countrySelCosts = null
  this.categoryCostsIIDS = null;
}

onRowEditInit(costsObj: CategoryCostsModel) {
  this.categoryCostsOne = costsObj;
  this.clonedCosts[costsObj.vehicle] = {...costsObj};
  console.log('1 clone', this.clonedCosts);
}

onRowEditSave(costs: CategoryCostsModel) {
  costs.statusChange = true;
  console.log('Row categoryCostsDS', this.categoryCostsDS);
}

onRowEditCancel(costs: CategoryCostsModel, index: number) {
  this.categoryCostsIIDS[index] = this.clonedCosts[costs.vehicle];
  console.log('2 clone', this.categoryCostsDS);
}
validateNumber(e: any) {
  const input = String.fromCharCode(e.charCode);
  const reg = /^\d*\.?\d{0,2}$/g;
  if (!reg.test(input)) {
    e.preventDefault();
  }
}


//------------------------------------------------------------------------//
// OPERATION REDIRECT
//------------------------------------------------------------------------//

functionRedirectToCategories() {
  this.router.navigate(['/categories']);
}

public openConfirmationDialog(title: string, msg: string) {
  this.confirmationDialogService.confirm(title,  msg)
  .then((confirmed) => console.log('User confirmed:', confirmed))
  .catch(() => console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'));
}

}
