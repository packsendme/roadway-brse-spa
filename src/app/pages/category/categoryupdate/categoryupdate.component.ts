import { TransportTypeService } from './../../../service/transport-type.service';
import { DataTO } from './../../../model/dataTO';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { VehicleModel } from 'app/model/vehicle-model';
import { VehicleService } from 'app/service/vehicle.service';
import { ToastrService } from 'ngx-toastr';
import { CategoryService } from 'app/service/category.service';
import { LocationModel } from 'app/model/location-model';
import { ConfirmationDialogService } from 'app/service/confirmation-dialog.service';
import { CategoryModel } from 'app/model/category-model';
import { TransportTypeModel } from 'app/model/transport-type-model';
import { UnityMeasurementModel } from 'app/model/unity-measurement-model';
import { UnityMeasurementService } from 'app/service/unity-measurement.service';

@Component({
  selector: 'app-categoryupdate',
  templateUrl: './categoryupdate.component.html',
  styleUrls: ['./categoryupdate.component.css']
})
export class CategoryupdateComponent implements OnInit {

  // List Another Requests
  categories: CategoryModel[];
  vehicles: VehicleModel[];
  locations: LocationModel[];
  transporties: TransportTypeModel[];
  unityMeasurements: UnityMeasurementModel[];

  // Screen Option
  categoryOne_Obj = {} as CategoryModel;
  statusDelete_btn = true;
  statusEditNew_btn = true;
  isShow = false;
  isEdit = false;
  editdisabled = true;
  viewButton = false;

    // Edit Object - Entity

  nameCategoryLevelEdit_Obj: string;
  categoryEdit_Obj = {} as CategoryModel;
  countryEdit_Obj = {} as LocationModel;
  vehicleEdit_Obj = {} as VehicleModel;
  transportEdit_Obj = {} as TransportTypeModel;

  constructor(
    private categoryData: DataTO,
    private unityMeasurementService: UnityMeasurementService,
    private categoryService: CategoryService,
    private vehicleService: VehicleService,
    private transportService: TransportTypeService,
    private toastr: ToastrService,
    private router: Router,
    private confirmationDialogService: ConfirmationDialogService) {
      if ( this.categoryData.categoryruleData != null ) {
        this.categoryOne_Obj = this.categoryData.categoryruleData;
        this.isEdit = true;
      } else {
        this.categoryOne_Obj = {} as CategoryModel;
      }
    }

  ngOnInit(): void {
    this.findVehicles();
    this.findTransporties();
    this.findUnityMeasurement();
  }

// ------------------------------------------------------------------------//
// OPERATION ::  REQUESTs - EXTERNAL
// ------------------------------------------------------------------------//

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
    this.transportEdit_Obj = transportiesVet.find(transp => transp.name_transport === this.categoryOne_Obj.transport);
  });
}

findUnityMeasurement() {
  let unityMeasurementVet: UnityMeasurementModel[] = [];
  this.unityMeasurementService.getUnityMeasurement().subscribe((unityMeasurementData: Response) => {
    const unityMeasurementDataStr = JSON.stringify(unityMeasurementData.body);
    JSON.parse(unityMeasurementDataStr, function (key, value) {
      if (key === 'unityMeasurements') {
        unityMeasurementVet = value;
        return value;
      } else {
        return value;
      }
    });
  this.unityMeasurements = unityMeasurementVet;
  console.log('unityMeasurements', this.unityMeasurements);
  });
}

// ------------------------------------------------------------------------//
// OPERATION ::  TRANSACTION - CRUD
// ------------------------------------------------------------------------//

  prepareUpdate(event: any) {
    let statusChange = false;
    let msgUpdate: string;

    if ( this.categoryOne_Obj.vehicles.length === 0 ) {
        statusChange = true;
    }

    if ( statusChange === false ) {
      msgUpdate = 'Do you confirm the change of the registered category data?';
    } else {
      msgUpdate = 'There are costs in the cost table that have a default value of 0.00. Do you still want to save the category?';
    }

    this.confirmationDialogService.confirm('Update', msgUpdate)
    .then((result) => {
      if ( result === true ) {

        const entity: CategoryModel = {
          id: this.categoryOne_Obj.id,
          name_category: this.categoryOne_Obj.name_category,
          transport: this.categoryOne_Obj.transport,
          weight_min: this.categoryOne_Obj.weight_min,
          weight_max: this.categoryOne_Obj.weight_max,
          unity_measurement_weight_min: this.categoryOne_Obj.unity_measurement_weight_min,
          unity_measurement_weight_max: this.categoryOne_Obj.unity_measurement_weight_max,
          vehicles: this.categoryOne_Obj.vehicles,
        }
        this.updateCategory(event, entity);
      }
    })
    .catch(() => console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'));
  }

  updateCategory(event: any,  entity: CategoryModel){
    this.categoryService.putCategory(entity).subscribe({
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

// ------------------------------------------------------------------------//
// OPERATION ::  NOTIFICATION
// ------------------------------------------------------------------------//


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


// ------------------------------------------------------------------------//
// OPERATION ::   Transaction Field Value
// ------------------------------------------------------------------------//


onChangeTransportLevel() {
  const nameCategoryEdit_Obj = 'CAT_';
  this.categoryOne_Obj.name_category = nameCategoryEdit_Obj + this.transportEdit_Obj.initials;
}

// FIELD CATEGORY ---------------------//
addTransport() {
  this.categoryOne_Obj.transport = this.transportEdit_Obj.name_transport;
}

// FIELD VEHICLE ---------------------//
removeVehicle(vehicleEditSelect: VehicleModel) {
  console.log(' removeVehicle() ', vehicleEditSelect);
  const error = 'It is not possible to delete a single vehicle that is registered';

  if ( this.categoryOne_Obj.vehicles.length > 1) {
    const vehicleObj = this.categoryOne_Obj.vehicles.findIndex(vehicle => vehicle.vehicle_type === vehicleEditSelect.vehicle_type);
    this.categoryOne_Obj.vehicles.splice(vehicleObj, 1);
    console.log(' removeVehicle() vehicles ',  this.categoryOne_Obj.vehicles);

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
  } else {
    this.transactionOrchestrator(null, 'ValidationII');
  }
}

// ------------------------------------------------------------------------//
// OPERATION REDIRECT
// ------------------------------------------------------------------------//

functionRedirectToCategories() {
  this.router.navigate(['/categories']);
}

functionRedirectToTransport() {
  this.router.navigate(['/transport']);
}

public openConfirmationDialog(title: string, msg: string) {
  this.confirmationDialogService.confirm(title,  msg)
  .then((confirmed) => console.log('User confirmed:', confirmed))
  .catch(() => console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'));
}

}
