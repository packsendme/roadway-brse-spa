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
  statusDelete_btn = true;
  statusEditNew_btn = true;
  isShow = false;
  isEdit = false;
  editdisabled = true;
  viewButton = false;

  // Model Costs to HTML
  categoryCostsDS: CategoryCostsModel[] = [];
  clonedCosts: { [s: string]: CategoryCostsModel; } = {};

  locationCosts: String[] = [];
  displayColumns: string[] = ['vehicle', 'weight_cost', 'distance_cost', 'worktime_cost', 'average_consumption_cost', 'action'];

  constructor(
    private categoryData: CategoryData,
    private categoryService: CategoryService,
    private categoryTypeService: CategoryTypeService,
    private locationService: LocationService,
    private vehicleService: VehicleService,
    private toastr: ToastrService,
    private router: Router) {
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
    this.generateCostsTable()
  }

  //--------- REQUESTs - EXTERNAL ---------------------------------------//

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
    this.categoryOne_Obj = {} as CategoryRuleModel;
    this.categoryCostsOne = {} as CategoryCostsModel;
    this.statusEditNew_btn = true;
    this.statusDelete_btn = true;
    this.categoryCostsDS = [];
    this.clonedCosts = {};
    this.isShow = false;
  }

  saveEditCategory(event: any) {
    const categoryCostsArray: CategoryCostsModel[] = [];

    console.log('categoryOne_Obj - locations ', this.categoryOne_Obj.locations.length);
    console.log('categoryOne_Obj - vehicles ', this.categoryOne_Obj.vehicles.length);

    this.categoryOne_Obj.locations.forEach( (location) => {
      this.categoryCostsDS.forEach( (catCosts) => {
        if ( location.countryName === catCosts.countryName ) {
          categoryCostsArray.push(catCosts);
        }
      });
    });
    const categoryRuleEntity: CategoryRuleModel = {
      id: null,
      categoryType: this.categoryOne_Obj.categoryType,
      vehicles: this.categoryOne_Obj.vehicles,
      locations: this.categoryOne_Obj.locations,
      categoryCosts: categoryCostsArray}

    console.log('MAPS ', categoryRuleEntity);
     var jsonS = JSON.stringify(categoryRuleEntity);
    console.log('JSON ', jsonS);


    // Transaction Save
    //if (this.categoryOne_Obj.id === null) {

    this.categoryService.postCategory(categoryRuleEntity).subscribe({
        next: data => this.transactionOrchestrator(event, 'Save'),
        error: error => this.showNotification('bottom', 'center', error, 'error')
      });
    /*} else if (this.categoryOne_Obj.id != null) {
      this.categoryService.putCategory(categoryRuleEntity).subscribe({
        next: data => this.transactionOrchestrator(event, 'Update'),
        error: error => this.showNotification('bottom','center', error, 'error')
      });*/
    //}
    this.statusDelete_btn = true;
  }

  deleteCategory(event: any){
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
      let countryOld: string = null;
      let countryVetAdd: string = null;
      let countrySame = true;
      let statusAddVet = false;

      locations.forEach(function (value1) {
        locationsCosts.push(value1.countryName);
        countryS = value1.countryName;
         vehiclies.forEach(function (vehicle) {
          statusAddVet = false;
          costsV.forEach(function (costs) {
            if ( countryS === countryOld) {
              countrySame = false;
            } else if ( countryS !== countryOld) {
              countrySame = true;
            }
            console.log('countryS', countryS)
            console.log('vehicle', vehicle.vehicle_type)
            console.log('costs', costs.vehicle)

            if (vehicle.vehicle_type === costs.vehicle) {
              categoryCostsObj = {
              vehicle: costs.vehicle, countryName: countryS,
              weight_cost: costs.weight_cost, distance_cost: costs.distance_cost,
              worktime_cost: costs.worktime_cost, average_consumption_cost: costs.average_consumption_cost,
              rate_exchange: costs.rate_exchange, current_exchange: costs.current_exchange,
              countryNew: countrySame};
              categoryCosts.push(categoryCostsObj);
              statusAddVet = true;
            }
            // Add Object geneate to Array
            countryOld = countryS;
          })
          if ( statusAddVet === false) {
            console.log(' Entrou AddVet ');

            if (( countryS === countryOld) && (categoryCosts.length === 0)) {
              countrySame = true;
            } else if ( countryS === countryVetAdd) {
              countrySame = false;
            } else if ( countryS !== countryVetAdd) {
              countrySame = true;
            }
            categoryCostsObj = {
              vehicle: vehicle.vehicle_type, countryName: countryS,
              weight_cost: valueCosts, distance_cost: valueCosts,
              worktime_cost: valueCosts, average_consumption_cost: valueCosts,
              rate_exchange: valueCosts, current_exchange: valueCosts,
              countryNew: countrySame};
            categoryCosts.push(categoryCostsObj);
            countryVetAdd = countryS;
          }
        })

      })
      this.categoryCostsDS = categoryCosts;
      this.locationCosts = locationsCosts;
    }
  }

// --------------------------------------------------------------------------------//

selectCategory(event: any, categorySelect: any) {
  this.statusDelete_btn = false;
  this.statusEditNew_btn = false;
  this.categoryOne_Obj = categorySelect;
}

transactionOrchestrator(event: any, type: String) {
  let msgTransaction = '' as  String;
  switch (type) {
    case 'Save': {
      msgTransaction = 'Register Success';
      type = 'success';
      this.categoryOne_Obj = {} as CategoryRuleModel;
      event.resetForm(event);
    }
    case 'Update': {
      msgTransaction = 'Update Success';
      type = 'success';
      this.categoryOne_Obj = {} as CategoryRuleModel;
      event.resetForm(event);
    }
    case 'Delete': {
      msgTransaction = 'Delete Success';
      type = 'success';
      this.categoryOne_Obj = {} as CategoryRuleModel;
      event.resetForm(event);
    }
    case 'Validation': {
      msgTransaction = 'Check the required fields';
      type = 'error';
      console.log('Validation');
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



// Costs Operation CRUD Table ----------------------------------------------------------------------//

onRowEditInit(costsObj: CategoryCostsModel) {
  this.categoryCostsOne = costsObj;
  this.clonedCosts[costsObj.vehicle] = {...costsObj};
  console.log('1 clone', this.clonedCosts);
}
onRowEditSave(costs: CategoryCostsModel) {
  console.log('Row categoryCostsDS', this.categoryCostsDS);
}
onRowEditCancel(costs: CategoryCostsModel, index: number) {
  this.categoryCostsDS[index] = this.clonedCosts[costs.vehicle];
  console.log('2 clone', this.categoryCostsDS);
}
validateNumber(e: any) {
  const input = String.fromCharCode(e.charCode);
  const reg = /^\d*\.?\d{0,2}$/g;
  if (!reg.test(input)) {
    e.preventDefault();
  }
}

}
