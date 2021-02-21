import { VehicleClassificationService } from './../../../../service/vehicle-classification.service';
import { VehicleClassificationModel } from 'app/model/vehicle-classification-model';
import { Component, OnInit, Directive, ElementRef, HostListener } from '@angular/core';
import { VehicleService } from 'app/service/vehicle.service';
import { ToastrService } from 'ngx-toastr';
import { NgForm, FormGroup, FormControl } from '@angular/forms';
import { UnityMeasurementModel } from 'app/model/unity-measurement-model';
import { Router } from '@angular/router';
import { BodyworkModel } from 'app/model/bodywork-model';
import { BodyworkService } from 'app/service/bodywork.service';
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

  vehicleType: String = '';
  vehicleType_L: VehicleClassificationModel[];

  vehicleClassification: String = '';
  vehicleClassification_L: String[];
  vehicleSubcategory: String = '';
  vehicleSubclassification_L: String[];


  // List Another Requests
  vehicles: VehicleModel[];
  bodyworkes: BodyworkModel[];
  vehiclesTypes: VehicleClassificationModel[];
  unityMeasurements: UnityMeasurementModel[];
  unityWeightL: String[] = [];

  unityWeight = '';
  unityWeight_View = new Map<string, string>();
  unityWeight_M = new Map<string, string>();
  axis: string[] = ['2', '3', '6', '7', '9'];

  // Screen Option
  vehicleOne_Obj = {} as VehicleModel;
  isShowPeople = false;
  isShowCargo = false;
  isEdit = false;
  isDisabled = false;

  reactiveForm: FormGroup = new FormGroup({
    reactiveRadio: new FormControl(true)
  })

  constructor(
    private vehicleService: VehicleService,
    private bodyworkService: BodyworkService,
    private vehicleClassificationService: VehicleClassificationService,
    private unityMeasurementService: UnityMeasurementService,
    private toastr: ToastrService,
    private vehicleTO: DataTO,
    private confirmationDialogService: ConfirmationDialogService,
    private router: Router) {
      if ( this.vehicleTO.vehicleData != null ) {
        this.vehicleOne_Obj = vehicleTO.vehicleData;
        this.isEdit = true;
        this.titlePage = 'Vehicle Category - Edit';
        this.isDisabled = false;

        console.log('Vehicle 00', this.vehicleOne_Obj.classification_vehicle);
        console.log('Vehicle 01', this.vehicleOne_Obj.subclassification_vehicle);
        // tslint:disable-next-line:forin
        for (const a in this.vehicleOne_Obj.unity_weight) {
          this.unityWeight =  this.vehicleOne_Obj.unity_weight[a];
        }

        if (this.vehicleOne_Obj.transport_type === 'Cargo') {
          this.isShowCargo = true;
          this.isShowPeople = false;
        } else if (this.vehicleOne_Obj.transport_type === 'Passenger') {
          this.isShowPeople = true;
          this.isShowCargo = false;
        } else if (this.vehicleOne_Obj.transport_type === 'Mixed') {
          this.isShowPeople = true;
          this.isShowCargo = true;
        }
      } else {
        this.vehicleOne_Obj = {} as VehicleModel;
        this.isEdit = false;
        this.titlePage = 'Vehicle Category - New';
        this.isDisabled = true;
        this.isShowPeople = false;
        this.isShowCargo = false;
      }
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
  let vehiclesTypesVet: VehicleClassificationModel [] = [];
  const parameters = this.vehicleOne_Obj.type_vehicle;
  this.vehicleClassificationService.get().subscribe((vehicleTypeData: Response) => {
    const vehicleTypeDataStr = JSON.stringify(vehicleTypeData.body);
    JSON.parse(vehicleTypeDataStr, function (key, value) {
      if (key === 'vehiclesClassification') {
        vehiclesTypesVet = value;
        return value;
      } else {
         return value;
      }
    });
    this.vehicleType_L = vehiclesTypesVet;
    console.log('vehiclesClassification', this.vehicleType_L);
    if (this.isEdit === true) {
      this.findClassificationAndSub();
    }
  });
}

findClassificationAndSub() {
  let vehicleClassificationObj = {} as VehicleClassificationModel;
  vehicleClassificationObj = this.vehicleType_L.find(category => category.type_vehicle === this.vehicleOne_Obj.type_vehicle);
  this.vehicleClassification_L = vehicleClassificationObj.classification_vehicle
  this.vehicleSubclassification_L = vehicleClassificationObj.subclassification_vehicle;
}


findUnityMeasurement() {
  let unityMeasurementVet: UnityMeasurementModel[] = [];
  this.unityMeasurementService.get().subscribe((unityMeasurementData: Response) => {
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
    this.convertArrayToMapUnityWeghty();
  });
}

convertArrayToMapUnityWeghty() {
  const  unityWeight_Local = new Map<string, string>();
  // tslint:disable-next-line:forin
  this.unityMeasurements.forEach(function(unitObj) {
    // tslint:disable-next-line:forin
    for (const a in unitObj.unityWeight) {
      console.log('Cargo', unitObj.unityWeight[a]);
      console.log('Cargo A', a);
      unityWeight_Local.set(unitObj.unityWeight[a],a);
    }
  })
  this.unityWeight_View = unityWeight_Local;
  console.log('Cargo unityWeight_View', this.unityWeight_View);
}

// --------- OPERATION TRANSACTION - CRUD ---------------------------------------//

  getUnityWeightByMap(): any {
    const unityWeightLocal_M = new Map<string, string>();
    const key = this.unityWeight_View.get(this.unityWeight);
    const value = this.unityWeight;
    unityWeightLocal_M.set(key, value);
    const weightMapToArray = {};
    // tslint:disable-next-line:no-shadowed-variable
    unityWeightLocal_M.forEach((val: string, key: string) => {
      weightMapToArray[key] = val;
    });
    return weightMapToArray;
  }

  validateSave(event: any) {
    let msg: string;
    let statusSave = false;

    if ((this.vehicleOne_Obj.category_vehicle) && ( this.vehicleOne_Obj.bodywork_vehicle) &&
    (this.vehicleOne_Obj.classification_vehicle) && (this.vehicleOne_Obj.subclassification_vehicle)
    && (this.vehicleOne_Obj.fuel_consumption)) {
      if (this.vehicleOne_Obj.transport_type === 'Cargo') {
        if ((this.vehicleOne_Obj.weight_max) && (this.unityWeight) && (this.vehicleOne_Obj.axis_total) &&
        (this.vehicleOne_Obj.height_dimension_max) && (this.vehicleOne_Obj.width_dimension_max) &&
        (this.vehicleOne_Obj.length_dimension_max)) {
          statusSave = true;
          this.vehicleOne_Obj.people_max = 0;
          this.vehicleOne_Obj.unity_weight = this.getUnityWeightByMap();
        } else {
          statusSave = false;
        }
      } else if (this.vehicleOne_Obj.transport_type === 'Passenger') {
          if (this.vehicleOne_Obj.people_max !== 0) {
            statusSave = true;
            this.vehicleOne_Obj.weight_max = 0.0;
            this.vehicleOne_Obj.unity_weight = null; //this.getUnityWeightByMap();
          } else {
            statusSave = false;
          }
      }  else if (this.vehicleOne_Obj.transport_type === 'Mixed') {
          if ((this.vehicleOne_Obj.weight_max) && (this.unityWeight_M) && (this.vehicleOne_Obj.axis_total)
          && (this.vehicleOne_Obj.people_max !== 0)  &&
          (this.vehicleOne_Obj.height_dimension_max) && (this.vehicleOne_Obj.width_dimension_max) &&
          (this.vehicleOne_Obj.length_dimension_max)) {
            statusSave = true;
            this.vehicleOne_Obj.unity_weight = this.getUnityWeightByMap();
            const weightMapToArray = {};
            this.unityWeight_M.forEach((val: string, key: string) => {
              weightMapToArray[key] = val;
            });
            this.vehicleOne_Obj.unity_weight = this.getUnityWeightByMap();
          } else {
            statusSave = false;
          }
      } else {
        statusSave = false;
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

  save(event: any, msg: any) {
    // Transaction Save
    this.confirmationDialogService.confirm('Save', msg).then((result) => {
      if ( result === true ) {
        if (this.vehicleOne_Obj.id == null) {
          console.log('FUEL CONSUMPTION ', this.vehicleOne_Obj.fuel_consumption);

          this.vehicleService.postVehicle(this.vehicleOne_Obj).subscribe({
            next: data => this.transactionOrchestrator(event, 'Save'),
            error: error => this.showNotification('bottom', 'center', error, 'error')
          });
        } else if (this.vehicleOne_Obj.id != null) {
          console.log('FUEL CONSUMPTION ', this.vehicleOne_Obj.fuel_consumption);

          this.vehicleService.putVehicle(this.vehicleOne_Obj).subscribe({
            next: data => this.transactionOrchestrator(event, 'Update'),
            error: error => this.showNotification('bottom', 'center', error, 'error')
          });
        }
      }
    });
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

// ---------  NOTIFICATION MESSAGE -------------------------------------------------------------//

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

  toggleDisplay() {
    if (this.vehicleOne_Obj.transport_type === 'Cargo') {
      this.isShowCargo = true;
      this.isShowPeople = false;
      this.vehicleOne_Obj.people_max = 0;
    } else if (this.vehicleOne_Obj.transport_type === 'Passenger') {
      this.isShowPeople = true;
      this.isShowCargo = false;
      this.vehicleOne_Obj.weight_max = null;
      this.vehicleOne_Obj.unity_weight  = null;
      this.vehicleOne_Obj.axis_total = null;
    } else if (this.vehicleOne_Obj.transport_type === 'Mixed') {
      this.isShowPeople = true;
      this.isShowCargo = true;
      this.vehicleOne_Obj.weight_max = null;
      this.vehicleOne_Obj.unity_weight  = null;
      this.vehicleOne_Obj.axis_total = null;
    }
  }

  /* Operation Bodywork  ---------------------//
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
  */

  changeNameVehicle() {
    this.vehicleOne_Obj.category_vehicle = this.vehicleOne_Obj.type_vehicle + '-'
    + this.vehicleOne_Obj.classification_vehicle + '-' + this.vehicleOne_Obj.subclassification_vehicle;
  }

// OPERATION REDIRECT  ---------------------//

  functionRedirectToVehicleType() {
    this.router.navigate(['/vehicleclassification-crud']);
  }

  functionRedirectToVehicleView() {
    this.router.navigate(['/vehicle-view']);
  }

  functionRedirectToBodywork()  {
    this.router.navigate(['/bodywork-crud']);
  }
}
