import { UnityMeasurementService } from './../../service/unity-measurement.service';
import { VehicleTypeService } from './../../service/vehicle-type.service';
import { BodyWorkService } from './../../service/body-work.service';
import { BodyWorkModel } from './../../model/body-work-model';
import { VehicleTypeModel } from './../../model/vehicle-type-model';
import { Component, OnInit } from '@angular/core';
import { VehicleModel } from 'app/model/vehicle-model';
import { VehicleService } from 'app/service/vehicle.service';
import { ToastrService } from 'ngx-toastr';
import { NgForm } from '@angular/forms';
import { UnityMeasurementModel } from 'app/model/unity-measurement-model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-vehicle',
  templateUrl: './vehicle.component.html',
  styleUrls: ['./vehicle.component.css']
})
export class VehicleComponent implements OnInit {

  // List Another Requests
  vehicles: VehicleModel[];
  bodyworkes: BodyWorkModel[];
  vehiclesTypes: VehicleTypeModel[];
  unityMeasurements: UnityMeasurementModel[];
  axis: string[] = ['2', '3', '6', '7', '9'];
  peoples: string[] = ['0', '1 - 5', '5 - 15', '15 - 30', '30 - 45', '45 - N'];

  // Screen Option
  vehicleOne_Obj = {} as VehicleModel;
  statusDelete_btn = true;
  statusNew_btn = true;
  peopleTransport = true;
  isShow = false;

  constructor(private vehicleService: VehicleService,
    private bodyworkService: BodyWorkService,
    private vehicleTypeService: VehicleTypeService,
    private unityMeasurementService: UnityMeasurementService,
    private toastr: ToastrService,
    private router: Router) { }

  ngOnInit(): void {
    this.findBodywork();
    this.findVehicleType();
    this.findUnityMeasurement();
    this.findVehicles();
   }

//--------- REQUESTs - EXTERNAL ---------------------------------------//

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

findBodywork() {
  let bodyworkVet: BodyWorkModel[] = [];
  this.bodyworkService.getBodyWork().subscribe((bodyWorkData: Response) => {
  const bodyWorkStr = JSON.stringify(bodyWorkData.body);
  JSON.parse(bodyWorkStr, function (key, value) {
    if (key === 'bodies') {
      bodyworkVet = value;
      return value;
    } else {
        return value;
      }
    });
    this.bodyworkes = bodyworkVet;
  });
}

findVehicleType() {
  let vehiclesTypesVet: VehicleTypeModel [] = [];
  this.vehicleTypeService.getVehicleType().subscribe((vehicleTypeData: Response) => {
    const vehicleTypeDataStr = JSON.stringify(vehicleTypeData.body);
    JSON.parse(vehicleTypeDataStr, function (key, value) {
      if (key === 'vehiclesType') {
        vehiclesTypesVet = value;
        return value;
      } else {
         return value;
      }
    });
    this.vehiclesTypes = vehiclesTypesVet;
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
    });
  }


// --------- OPERATION TRANSACTION - CRUD ---------------------------------------//

  newRecord(event: any){
    event.resetForm(event);
    this.vehicleOne_Obj = {} as VehicleModel;
    this.statusNew_btn = true;
    this.statusDelete_btn = true;
  }

  saveEditVehicle(event: any) {
    // Transaction Save
    if (this.vehicleOne_Obj.id == null) {
      this.vehicleService.postVehicle(this.vehicleOne_Obj).subscribe({
        next: data => this.transactionOrchestrator(event, 'Save'),
        error: error => this.showNotification('bottom','center', error, 'error')
      });
    } else if (this.vehicleOne_Obj.id != null) {
      this.vehicleService.putVehicle(this.vehicleOne_Obj).subscribe({
        next: data => this.transactionOrchestrator(event, 'Update'),
        error: error => this.showNotification('bottom','center', error, 'error')
      });
    }
    this.statusDelete_btn = true;
  }

  deleteVehicle(event: any){
    console.log(' deleteVehicle ');
    this.statusDelete_btn = true;
    this.statusNew_btn = true;
    // Transaction Delete
    if (this.vehicleOne_Obj.id != null) {
      this.vehicleService.deleteVehicle(this.vehicleOne_Obj).subscribe({
        next: data => this.transactionOrchestrator(event, 'Delete'),
        error: error => this.showNotification('bottom', 'center', error, 'error')
      });
    }
  }

// --------------------------------------------------------------------------------//

selectLocation(event: any, vehicleSelect: any) {
  this.statusDelete_btn = false;
  this.statusNew_btn = false;
  this.vehicleOne_Obj = vehicleSelect;
}

transactionOrchestrator(event: any, type: String) {
    let msgTransaction = '' as  String;
    switch (type) {
      case 'Save': {
        msgTransaction = 'Register Success';
      }
      case 'Update': {
        msgTransaction = 'Update Success';
      }
      case 'Delete': {
        msgTransaction = 'Delete Success';
      }
    }
    this.findVehicles()
    this.showNotification('bottom', 'center', msgTransaction, 'success')
    event.resetForm(event);
    this.vehicleOne_Obj = {} as VehicleModel;
  }

  handleClear(f: NgForm){
    f.resetForm();
  }

  showNotification(from, align, msg, type) {
    const color = Math.floor(Math.random() * 5 + 1);
    switch (type) {
      case 'success':
        this.toastr.success(
          '<span data-notify="icon" class="nc-icon nc-bell-55"></span><span data-notify="message">'+ msg +'</span>',
          '',
          {
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
          '<span data-notify="icon" class="nc-icon nc-bell-55"></span><span data-notify="message">'+ msg +'</span>',
          '',
          {
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

  toggleDisplay(value: boolean) {
    this.isShow = value;
  }

  functionRedirectToVehicleType(){
    this.router.navigate(['/vehicletype']);
  }
}
