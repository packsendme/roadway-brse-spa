import { VehicleTypeModel } from './../../model/vehicle-type-model';
import { Component, OnInit } from '@angular/core';
import { VehicleTypeService } from 'app/service/vehicle-type.service';
import { ToastrService } from 'ngx-toastr';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-vehicletype',
  templateUrl: './vehicletype.component.html',
  styleUrls: ['./vehicletype.component.css']
})
export class VehicletypeComponent implements OnInit {

   // List Another Requests
   vehiclesTypes: VehicleTypeModel[];

  // Screen Option
  vehicleTypeOne_Obj = {} as VehicleTypeModel;
  statusDelete_btn = true;
  statusNew_btn = true;

  constructor(
    private vehicleTypeService: VehicleTypeService,
    private toastr: ToastrService) {
      this.findVehiclesType();
    }

  ngOnInit(): void {
  }

  //--------- REQUESTs - EXTERNAL ---------------------------------------//

  findVehiclesType() {
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

  // --------- OPERATION TRANSACTION - CRUD ---------------------------------------//

  newRecord(event: any){
    event.resetForm(event);
    this.vehicleTypeOne_Obj = {} as VehicleTypeModel;
    this.statusNew_btn = true;
    this.statusDelete_btn = true;
  }

  saveEditVehicleType(event: any){
    // Transaction Save
    if (this.vehicleTypeOne_Obj.id == null) {
      this.vehicleTypeService.postVehicleType(this.vehicleTypeOne_Obj).subscribe({
        next: data => this.transactionOrchestrator(event, 'Save'),
        error: error => this.showNotification('bottom','center', error, 'error')
      });
    } else if (this.vehicleTypeOne_Obj.id != null) {
      this.vehicleTypeService.putVehicleType(this.vehicleTypeOne_Obj).subscribe({
        next: data => this.transactionOrchestrator(event, 'Update'),
        error: error => this.showNotification('bottom','center', error, 'error')
      });
    }
    this.statusDelete_btn = true;
  }

  deleteVehicleType(event: any){
    console.log(' deleteVehicle ');
    this.statusDelete_btn = true;
    this.statusNew_btn = true;
    // Transaction Delete
    if (this.vehicleTypeOne_Obj.id != null) {
      this.vehicleTypeService.deleteVehicleType(this.vehicleTypeOne_Obj).subscribe({
        next: data => this.transactionOrchestrator(event, 'Delete'),
        error: error => this.showNotification('bottom', 'center', error, 'error')
      });
    }
  }

// --------------------------------------------------------------------------------//

selectLocation(event: any, vehicleSelect:any){
  this.statusDelete_btn = false;
  this.statusNew_btn = false;
  this.vehicleTypeOne_Obj = vehicleSelect;
}

transactionOrchestrator(event: any, type: String) {
    let msgTransaction = '' as  String;
    switch (type) {
      case 'Save': {
        msgTransaction = 'Register Success';
      }
      // tslint:disable-next-line:no-switch-case-fall-through
      case 'Update': {
        msgTransaction = 'Update Success';
      }
      case 'Delete': {
        msgTransaction = 'Delete Success';
      }
    }
    this.findVehiclesType()
    this.showNotification('bottom', 'center', msgTransaction, 'success')
    event.resetForm(event);
    this.vehicleTypeOne_Obj = {} as VehicleTypeModel;
  }

  handleClear(f: NgForm){
    console.log(" CLEAN");
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

}


