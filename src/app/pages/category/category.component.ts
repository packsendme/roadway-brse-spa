import { Location } from '@angular/common';
import { CategoryCostsModel } from './../../model/category-costs-model';
import { LocationModel } from './../../model/location-model';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CategoryTypeModel } from 'app/model/category-type-model';
import { VehicleModel } from 'app/model/vehicle-model';
import { CategoryTypeService } from 'app/service/category-type.service';
import { LocationService } from 'app/service/location.service';
import { VehicleService } from 'app/service/vehicle.service';
import { ToastrService } from 'ngx-toastr';
import { CategoryModel } from 'app/model/category-model';
import { CategoryService } from 'app/service/category.service';
import { NgForm } from '@angular/forms';



@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {

  // List Another Requests
  categories: CategoryModel[];
  categoriesTypes: CategoryTypeModel[];
  vehicles: VehicleModel[];
  locations: LocationModel[];

  // Screen Option
  categoryOne_Obj = {} as CategoryModel;
  categoryCostsOne = {} as CategoryCostsModel;
  statusDelete_btn = true;
  statusEditNew_btn = true;
  isShow = false;
  editdisabled = true;
  viewButton = false;



  // Model Costs to HTML
  categoryCostsDS: CategoryCostsModel[] = [];
  clonedCosts: { [s: string]: CategoryCostsModel; } = {};

  locationCosts: String[] = [];
  displayColumns: string[] = ['vehicle', 'weight_cost', 'distance_cost', 'worktime_cost', 'average_consumption_cost', 'action'];

  constructor(
    private categoryService: CategoryService,
    private categoryTypeService: CategoryTypeService,
    private locationService: LocationService,
    private vehicleService: VehicleService,
    private toastr: ToastrService,
    private router: Router) { }

  ngOnInit(): void {
    this.findCategoriesType();
    this.findVehicles();
    this.findLocations();
    this.findCategories();
  }

  //--------- REQUESTs - EXTERNAL ---------------------------------------//

  findCategories() {
    let categoriesVet: CategoryModel [] = [];
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
    this.categoryOne_Obj = {} as CategoryModel;
    this.categoryCostsOne = {} as CategoryCostsModel;
    this.statusEditNew_btn = true;
    this.statusDelete_btn = true;
    this.categoryCostsDS = [];
    this.clonedCosts = {};
    this.isShow = false;
  }

  saveEditCategory(event: any) {
    // tslint:disable-next-line:prefer-const
    let categoryCostsMap: Map<String, CategoryCostsModel[]> = new Map();
    let categoryCostsArray: CategoryCostsModel[] = [];

    this.categoryOne_Obj.locations.forEach( (location) => {
      this.categoryCostsDS.forEach( (catCosts) => {
        if ( location.countryName === catCosts.countryName ) {
          categoryCostsArray.push(catCosts);
        }
      });
      categoryCostsMap.set(location.countryName, categoryCostsArray);
      categoryCostsArray = [];
    });
    this.categoryOne_Obj.categoryCosts = categoryCostsMap;
    console.log('categoryOne_Obj - MAPS ', this.categoryOne_Obj);
    // Transaction Save
    if (this.categoryOne_Obj.id == null) {
      this.categoryService.postCategory(this.categoryOne_Obj).subscribe({
        next: data => this.transactionOrchestrator(event, 'Save'),
        error: error => this.showNotification('bottom', 'center', error, 'error')
      });
    } else if (this.categoryOne_Obj.id != null) {
      this.categoryService.putCategory(this.categoryOne_Obj).subscribe({
        next: data => this.transactionOrchestrator(event, 'Update'),
        error: error => this.showNotification('bottom','center', error, 'error')
      });
    }
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

  generateCostsTable(event: any) {
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
            countryNew: countrySame
          };
          // Add Object geneate to Array
          categoryCosts.push(categoryCostsObj);
          countryOld = countryS;
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
      this.findCategories()
      this.categoryOne_Obj = {} as CategoryModel;
      event.resetForm(event);
    }
    case 'Update': {
      msgTransaction = 'Update Success';
      type = 'success';
      this.findCategories()
      this.categoryOne_Obj = {} as CategoryModel;
      event.resetForm(event);
    }
    case 'Delete': {
      msgTransaction = 'Delete Success';
      type = 'success';
      this.findCategories()
      this.categoryOne_Obj = {} as CategoryModel;
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
