import { Component, HostListener, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { VehicleModel } from 'app/model/vehicle-model';
import { VehicleService } from 'app/service/vehicle.service';
import { ToastrService } from 'ngx-toastr';
import { CategoryService } from 'app/service/category.service';
import { NgForm } from '@angular/forms';
import { ConfirmationDialogService } from 'app/service/confirmation-dialog.service';
import { LocationModel } from 'app/model/location-model';
import { TransportTypeModel } from 'app/model/transport-type-model';
import { CategoryModel } from 'app/model/category-model';
import { UnityMeasurementModel } from 'app/model/unity-measurement-model';
import { UnityMeasurementService } from 'app/service/unity-measurement.service';
import { TransportTypeService } from 'app/service/transport-type.service';



@Component({
  selector: 'app-category',
  templateUrl: './category-new.component.html',
  styleUrls: ['./category-new.component.css']
})
export class CategoryNewComponent implements OnInit {

  // List Another Requests
  transporties: TransportTypeModel[];
  vehicles: VehicleModel[];
  unityMeasurements: UnityMeasurementModel[];
  unityWeightsL: String[] = [];

  // Screen Option
  statusDelete_btn = true;
  statusEditNew_btn = false;
  isShow = false;
  isEdit = false;
  editdisabled = true;
  viewButton = false;

  // New Object - Entity
  nameCategoryNew_Obj: string;
  nameCategoryLevelNew_Obj: string;
  weightMaxNew: number;
  unityWeightMaxNew: string;
  peopleMax: number;

  transportNew_Obj: TransportTypeModel;
  countryNew_Vet: LocationModel[] = [];
  countryNew_Obj = {} as LocationModel;
  vehicleNew_Vet: VehicleModel[] = [];
  vehicleNew_Obj = {} as VehicleModel;

  private regex: RegExp = new RegExp(/^-?[0-9]+(\.[0-9]*){0,1}$/g);
  private specialKeys: Array<string> = ['Backspace', 'Tab'];
  el: any;


  constructor(
    private unityMeasurementService: UnityMeasurementService,
    private transportService: TransportTypeService,
    private categoryService: CategoryService,
    private vehicleService: VehicleService,
    private toastr: ToastrService,
    private router: Router,
    private confirmationDialogService: ConfirmationDialogService) {}

  ngOnInit(): void {
    this.nameCategoryNew_Obj = 'CAT_';
    this.findTransporties();
   // this.findUnityMeasurement();
  }


  // --------- REQUESTs - EXTERNAL ---------------------------------------//

  findVehiclesByTransport() {
    let vehicleVet: VehicleModel[] = [];
    this.vehicleService.getVehicleByTransport(this.transportNew_Obj.transport_type).subscribe((vehicleData: Response) => {
      const vehicleStr = JSON.stringify(vehicleData.body);
      JSON.parse(vehicleStr, function (key, value) {
        if (key === 'vehicles') {
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
    this.transportService.get().subscribe((transportTypeData: Response) => {
      const transportTypeDataStr = JSON.stringify(transportTypeData.body);
      JSON.parse(transportTypeDataStr, function (key, value) {
        if (key === 'transports') {
          transportiesVet = value;
          return value;
        } else {
           return value;
        }
      });
      this.transporties = transportiesVet;
      console.log(this.transporties);
    });
  }

/*
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
    this.findUnityWeghty();
    });

  }*/
/*
  findUnityWeghty() {
    const unityWeightLocal: String[] = []
    console.log('EGHTY TTEE')
    this.unityMeasurements.forEach(function (unity) {
      unity.unityWeight.forEach(function (weight) {
        console.log(weight);
        unityWeightLocal.push(weight);
      })
    })
    this.unityWeightsL = unityWeightLocal;
  }*/

// ---------------------------------------------------------------------//
// OPERATION :: TRANSACTION - CRUD
// ---------------------------------------------------------------------//

  prepareSave(event: any) {
    let msg: string;
    if (this.vehicleNew_Vet.length === 0) {
      msg = 'Do you include a new category?';
    } else {
      msg = 'Do you confirm the inclusion of the new category?';
      this.confirmationDialogService.confirm('Save', msg)
      .then((result) => {
        if ( result === true ) {
          const categoryEntity: CategoryModel = {
            id: null,
            name_category: this.nameCategoryNew_Obj + this.nameCategoryLevelNew_Obj,
            transport: this.transportNew_Obj.name_transport,
            weight_max: this.weightMaxNew,
            unity: this.unityWeightMaxNew,
            vehicles: this.vehicleNew_Vet,
            people_max: this.peopleMax

          }
          this.saveCategory(event, categoryEntity);
        }
      })
      .catch(() => console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'));
    }
  }

  saveCategory(event: any,  entity: CategoryModel) {
    this.categoryService.postCategory(entity).subscribe({
      next: data => this.transactionOrchestrator(event, 'Save'),
      error: error => this.showNotification('bottom', 'center', error, 'error')
    });
  }



// ------------------------------------------------------------------------//
// OPERATION ::   Transaction Field Value
// ------------------------------------------------------------------------//


onChangeTransportLevel() {
  console.log(' onChangeTransportLevel() ', this.transportNew_Obj.initials);
  this.nameCategoryLevelNew_Obj = this.transportNew_Obj.initials;
  this.findVehiclesByTransport();
}

// FIELD VEHICLE ---------------------//
removeVehicle(vehicleEditSelect: VehicleModel) {
  console.log(' removeVehicle() ', vehicleEditSelect);
  const error = 'It is not possible to delete a single vehicle that is registered';

  if ( this.vehicleNew_Vet.length > 1) {
    const vehicleObj = this.vehicleNew_Vet.findIndex(vehicle => vehicle.vehicle_type === vehicleEditSelect.vehicle_type);
    this.vehicleNew_Vet.splice(vehicleObj, 1);
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
   // this.calcRuleInstanceWeight();
  } else {
    this.transactionOrchestrator(null, 'ValidationII');
  }
}

// ------------------------------------------------------------------------//
// CALC WEIGHT MIN/MAX
// ------------------------------------------------------------------------//
// vehicleNew_Obj = {} as VehicleModel;

calcRuleInstanceWeight(vehicleObj: VehicleModel) {
    if (vehicleObj.cargo_max > this.weightMaxNew) {
      if ((vehicleObj.unity_measurement_weight === this.unityWeightMaxNew) || (this.unityWeightMaxNew)) {
        this.weightMaxNew = vehicleObj.cargo_max;
      }
    } else{

    }

}



// ------------------------------------------------------------------------//
// NOTIFICATION :: MENSAGEM
// ------------------------------------------------------------------------//

transactionOrchestrator(event: any, type: String) {
  let msgTransaction = '' as  String;
  switch (type) {
    case 'Save': {
      msgTransaction = 'Register Success';
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

// ------------------------------------------------------------------------//
// REDIRECT :: HTP
// ------------------------------------------------------------------------//

  functionRedirectToVehicle() {
    this.router.navigate(['/vehicle-crud']);
  }

  functionRedirectToTransport() {
    this.router.navigate(['/transport-crud']);
  }

  functionRedirectToCategories() {
    this.router.navigate(['/category-view']);
  }

  functionRedirectToUnityMensurement() {
    this.router.navigate(['/unitymeasurement-crud']);
  }


}
