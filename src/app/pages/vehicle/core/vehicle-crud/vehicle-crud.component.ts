import { Component, OnInit } from '@angular/core';
import { VehicleService } from 'app/service/vehicle.service';
import { ToastrService } from 'ngx-toastr';
import { NgForm, FormGroup, FormControl } from '@angular/forms';
import { UnityMeasurementModel } from 'app/model/unity-measurement-model';
import { Router } from '@angular/router';
import { BodyworkModel } from 'app/model/bodywork-model';
import { VehicleTypeModel } from 'app/model/vehicle-type-model';
import { BodyworkService } from 'app/service/bodywork.service';
import { VehicleTypeService } from 'app/service/vehicle-type.service';
import { UnityMeasurementService } from 'app/service/unity-measurement.service';
import { ConfirmationDialogService } from 'app/service/confirmation-dialog.service';
import { DataTO } from 'app/model/dataTO';
import { VehicleModel } from 'app/model/vehicle-model';

@Component({
  selector: 'app-vehicle',
  templateUrl: './vehicle-crud.component.html',
  styleUrls: ['./vehicle-crud.component.css']
})
export class VehicleCrudComponent implements OnInit {

  // Response-Edit
  bodyworkEdit: string;
  titlePage: string;

  // List Another Requests
  vehicles: VehicleModel[];
  bodyworkes: BodyworkModel[];
  vehiclesTypes: VehicleTypeModel[];
  unityMeasurements: UnityMeasurementModel[];
  axis: string[] = ['2', '3', '6', '7', '9'];
  peoples: string[] = ['0', '1 - 5', '5 - 15', '15 - 30', '30 - 45', '45 - N'];

  // Screen Option
  vehicleOne_Obj = {} as VehicleModel;
  statusDelete_btn = true;
  statusNew_btn = true;
  isShow = false;
  isEdit = false;
  isDisabled = false;

  reactiveForm: FormGroup = new FormGroup({
    reactiveRadio: new FormControl(true)
  })

  constructor(private vehicleService: VehicleService,
    private bodyworkService: BodyworkService,
    private vehicleTypeService: VehicleTypeService,
    private unityMeasurementService: UnityMeasurementService,
    private toastr: ToastrService,
    private vehicleTO: DataTO,
    private confirmationDialogService: ConfirmationDialogService,
    private router: Router) {
      if ( this.vehicleTO.vehicleData != null ) {
        this.statusDelete_btn = false;
        this.statusNew_btn = false;
        this.vehicleOne_Obj = vehicleTO.vehicleData;
        this.isEdit = true;
        this.titlePage = 'Vehicle Category - Edit';
        this.isDisabled = false;
      } else {
        this.vehicleOne_Obj = {} as VehicleModel;
        this.isEdit = false;
        this.titlePage = 'Vehicle Category - Save';
        this.isDisabled = true;
      }
      console.log(' LOGS - people_transport ', this.vehicleOne_Obj.people_transport);
      this.isShow = this.vehicleOne_Obj.people_transport;
    }

  ngOnInit(): void {
    this.findBodywork();
    this.findVehicleType();
    this.findUnityMeasurement();
  }

// --------- REQUESTs - EXTERNAL ---------------------------------------//

findBodywork() {
  let bodyworkVet: BodyworkModel[] = [];
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

  validateSave(event: any) {
    let msg: string;
    let statusSave = false;
    if ((this.vehicleOne_Obj.vehicle_type) && (this.vehicleOne_Obj.bodywork_vehicle) && (this.vehicleOne_Obj.cargo_max) &&
    ( this.vehicleOne_Obj.people_transport !== undefined ) && ( this.vehicleOne_Obj.unity_measurement_weight ) &&
    (this.vehicleOne_Obj.axis_total)) {
      if (this.vehicleOne_Obj.people_transport === false) {
        statusSave = true;
      } else if ( (this.vehicleOne_Obj.people_transport === true) && (this.vehicleOne_Obj.people)) {
        statusSave = true;
      }
    }

    if (statusSave === true) {
      msg = 'Confirms the transaction to save the item in the database?';
      this.save(event, msg);
    } else {
      msg = 'Check the required fields';
      this.showNotification('bottom', 'center', msg, 'error');
    }
  }

  newRecord(event: any){
    event.resetForm(event);
    this.vehicleOne_Obj = {} as VehicleModel;
    this.statusNew_btn = true;
    this.statusDelete_btn = true;
  }

  save(event: any, msg: any) {
    // Transaction Save
    this.confirmationDialogService.confirm('Save', msg).then((result) => {
      if ( result === true ) {
        if (this.vehicleOne_Obj.id == null) {
          this.vehicleService.postVehicle(this.vehicleOne_Obj).subscribe({
            next: data => this.transactionOrchestrator(event, 'Save'),
            error: error => this.showNotification('bottom', 'center', error, 'error')
          });
        } else if (this.vehicleOne_Obj.id != null) {
          this.vehicleService.putVehicle(this.vehicleOne_Obj).subscribe({
            next: data => this.transactionOrchestrator(event, 'Update'),
            error: error => this.showNotification('bottom', 'center', error, 'error')
          });
        }
      }
    });
    this.statusDelete_btn = true;
  }

  delete(event: any) {
    const msg = 'Confirms the transaction to delete the item from the database?';
    if ( this.vehicleOne_Obj != null ) {
      this.confirmationDialogService.confirm('Delete', msg).then((result) => {
        if ( result === true ) {
            // Transaction Delete
          if (this.vehicleOne_Obj.id != null) {
            this.vehicleService.deleteVehicle(this.vehicleOne_Obj).subscribe({
              next: data => this.transactionOrchestrator(event, 'Delete'),
              error: error => this.showNotification('bottom', 'center', error, 'error')
            });
          }
        }
      });
    }
  }

// --------------------------------------------------------------------------------//

transactionOrchestrator(event: any, type: String) {
  let msgTransaction = '' as  String;
  switch (type) {
    case 'Update': {
      msgTransaction = 'Update Success';
      type = 'success';
      console.log('Update Success');
      this.functionRedirectToVehicleView();
      break;
    }
    case 'Save': {
      msgTransaction = 'Register Success';
      type = 'success';
      this.functionRedirectToVehicleView();
      break;
    }
    case 'Delete': {
      msgTransaction = 'Delete Success';
      type = 'success';
      this.functionRedirectToVehicleView();
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

  // Operation Bodywork  ---------------------//

  addBodywork() {
    let statusAdd = false;
    if ( this.vehicleOne_Obj.bodywork_vehicle.length >= 1) {
      this.vehicleOne_Obj.bodywork_vehicle.forEach( (bodyworkObj) => {
        if (bodyworkObj === this.bodyworkEdit) {
          statusAdd = true;
        }
      })
    }

    if ( statusAdd === false ) {
      this.vehicleOne_Obj.bodywork_vehicle.push(this.bodyworkEdit);
    } else {
      this.transactionOrchestrator(null, 'ValidationII');
    }
  }


  removeBodywork(bodyworkEditSelect: string) {
    const error = 'It is not possible delete';

    if (  this.vehicleOne_Obj.bodywork_vehicle.length > 1) {
      const vehicleObj = this.vehicleOne_Obj.bodywork_vehicle.findIndex(bodywork => bodywork === bodyworkEditSelect);
      this.vehicleOne_Obj.bodywork_vehicle.splice(vehicleObj, 1);
    } else if ( this.vehicleOne_Obj.bodywork_vehicle.length === 1) {
      this.showNotification('bottom','center', error, 'error')
    }
  }

  selectLocation(event: any, vehicleSelect: any) {
    this.statusDelete_btn = false;
    this.statusNew_btn = false;
    this.vehicleOne_Obj = vehicleSelect;
    this.isShow = this.vehicleOne_Obj.people_transport;
  }

  // OPERATION REDIRECT  ---------------------//


  functionRedirectToVehicleType() {
    this.router.navigate(['/vehicletype-crud']);
  }

  functionRedirectToVehicleView() {
    this.router.navigate(['/vehicle-view']);
  }

  functionRedirectToBodywork()  {
    this.router.navigate(['/bodywork-crud']);
  }
}
