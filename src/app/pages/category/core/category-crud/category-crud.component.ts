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
import { DataTO } from 'app/model/dataTO';
import { DatePipe } from '@angular/common'
import { InitialsModel } from 'app/model/initials-model';
import { InitialsService } from 'app/service/initials.service';

// tslint:disable-next-line:class-name
interface weightUnitI {
  people_max: number;
  weight_max: number;
  unit: string;
  index: number;

}

@Component({
  selector: 'app-category',
  templateUrl: './category-crud.component.html',
  styleUrls: ['./category-crud.component.css']
})


export class CategoryCrudComponent implements OnInit {

  // List Another Requests
  transporties: TransportTypeModel[] = [];
  nameTransport: string = '';
  vehicles: VehicleModel[];
  unityMeasurements: UnityMeasurementModel[];
  unityWeightsL: String[] = [];
  initialies: InitialsModel[];
  dt_incS = null;
  dt_updateS = null;

  // Screen Option
  categoryOne_Obj = {} as CategoryModel;
  isEdit = false;
  isvisible = true;
  isCargoMix = false;
  isPeople = false;
  isMixed = false;
  // New Object - Entity
  weightUnityTransport_max: string;
  weightUnityVehicle_max: string;
  weightVehicleMaxNew = 0;

  nameBusinessCategory: string;
  unityWeightValue_S: string;
  unityWeightKey_Index: number = 0;
  peopleMax = 0;
  unityWeight_M = new Map<number, string>();
  initials: string;

  transportNew_Obj = {} as TransportTypeModel;
  countryNew_Vet: LocationModel[] = [];
  countryNew_Obj = {} as LocationModel;
  vehicleNew_Vet: VehicleModel[] = [];
  vehicleNew_Obj = {} as VehicleModel;
  weightUnitArray: weightUnitI[];
  categoryObjEntity: CategoryModel;

  constructor(
    private categoryData: DataTO,
    private initialsService: InitialsService,
    private transportService: TransportTypeService,
    private categoryService: CategoryService,
    private vehicleService: VehicleService,
    private toastr: ToastrService,
    private router: Router,
    private confirmationDialogService: ConfirmationDialogService) {
      if ( this.categoryData.categoryruleData != null ) {
        this.categoryOne_Obj = this.categoryData.categoryruleData;
        this.transportNew_Obj = this.categoryOne_Obj.transport;
        this.nameTransport = this.transportNew_Obj.name_transport;
        console.log('AAA', this.transportNew_Obj);
        this.isEdit = true;
        this.isvisible = false;
        this.dt_incS = this.categoryOne_Obj.dt_inc.toLocaleString();
        if (this.categoryOne_Obj.dt_update) {
          this.dt_updateS = this.categoryOne_Obj.dt_update.toLocaleString();
        }
        this.nameBusinessCategory = this.categoryOne_Obj.name_category;
        this.vehicleNew_Vet = this.categoryOne_Obj.vehicles;
        this.weightUnityVehicle_max = this.categoryOne_Obj.weightUnityVehicle_max;
        this.weightUnityTransport_max = this.categoryOne_Obj.weightUnityTransport_max;
        this.peopleMax = this.categoryOne_Obj.people_max;
        this.initials = this.categoryOne_Obj.initials;
      } else {
        this.nameBusinessCategory = 'CAT_';
        this.categoryOne_Obj = {} as CategoryModel;
      }
    }

  ngOnInit(): void {
    this.findTransporties();
  }


  // --------- REQUESTs  - EXTERNAL ---------------------------------------//

  findVehiclesByTransport() {
    let vehicleVet: VehicleModel[] = [];
    this.vehicleService.getVehicleByCargo(this.transportNew_Obj.transport_type).subscribe((vehicleData: Response) => {
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
      console.log('transports', this.transporties.length);
      if (this.isEdit === true) {
          if (this.categoryOne_Obj.transport.transport_type === 'Cargo') {
            this.isCargoMix = true;
            this.isPeople = false;
            this.isMixed = false;
          } else if (this.categoryOne_Obj.transport.transport_type === 'Passenger') {
            this.isPeople = true;
            this.isCargoMix = false;
            this.isMixed = false;
          } else if (this.categoryOne_Obj.transport.transport_type === 'Mixed') {
            this.isMixed = true;
            this.isPeople = false;
            this.isCargoMix = false;
          }
        this.findVehiclesByTransport();
      }
    });
  }

// ---------------------------------------------------------------------//
// OPERATION :: TRANSACTION - CRUD
// ---------------------------------------------------------------------//

  validateSave(event: any) {
    let msg: string;

    this.unityWeight_M.set(this.unityWeightKey_Index, this.unityWeightValue_S);
    const weightMapToArray = {};
      this.unityWeight_M.forEach((val: string, key: number) => {
      weightMapToArray[key] = val;
    });

    if ((this.transportNew_Obj) && (this.vehicleNew_Vet.length !== 0) && (this.unityWeight_M.size !== 0)) {
      msg = 'Confirm the transaction in the database?';
      let dt_updateD = null;
      let dt_incD = null;

      if(this.isEdit === true) {
        dt_updateD = new Date();
        dt_incD = this.categoryOne_Obj.dt_inc;
      } else{
        dt_updateD = null;
        dt_incD = new Date()
      }

      this.categoryObjEntity = {
        id: this.categoryOne_Obj.id,
        name_category: this.nameBusinessCategory,
        initials: this.initials,
        transport_name: this.transportNew_Obj.name_transport,
        transport: this.transportNew_Obj,
        weightUnityVehicle_max: this.weightUnityVehicle_max,
        weightUnityTransport_max: this.weightUnityTransport_max,
        vehicles: this.vehicleNew_Vet,
        people_max: this.peopleMax,
        dt_inc: dt_incD,
        dt_update: dt_updateD
      };
      this.save(this.categoryObjEntity, msg);
    } else {
      msg = 'Check the required fields';
      this.showNotification('bottom', 'center', msg, 'error');
    }
  }

  save(categoryObj: CategoryModel, msg: any) {
    this.confirmationDialogService.confirm('Save', msg).then((result) => {
      if ( result === true ) {
         // Transaction Save
        if (categoryObj.id == null) {
          this.categoryService.post(categoryObj).subscribe({
            next: data => this.transactionOrchestrator(event, 'Save'),
            error: error => this.showNotification('bottom', 'center', error, 'error')
          });
        } else if (categoryObj.id != null) {
          this.categoryService.put(categoryObj).subscribe({
            next: data => this.transactionOrchestrator(event, 'Update'),
            error: error => this.showNotification('bottom', 'center', error, 'error')
          });
        }
      }
    })
    .catch(() => console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'));
  }

  delete(event: any) {
    const msg = 'Confirms the transaction to delete the item from the database?';
    if ( this.categoryOne_Obj.id != null ) {
      this.confirmationDialogService.confirm('Delete', msg).then((result) => {
        if ( result === true ) {
          // Transaction Delete
          if (this.categoryOne_Obj.id  != null) {
            this.categoryService.delete(this.categoryOne_Obj.id).subscribe({
              next: data => this.transactionOrchestrator(event, 'Delete'),
              error: error => this.showNotification('bottom', 'center', error, 'error')
            });
          }
        }
      })
      .catch(() => alert('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'));
    }
  }

// ------------------------------------------------------------------------//
// OPERATION ::   Transaction Field Value
// ------------------------------------------------------------------------//

onChangeTransportLevel() {
  this.nameBusinessCategory = '';
  if (this.transportNew_Obj.transport_type === 'Cargo') {
    this.isCargoMix = true;
    this.isPeople = false;
    this.isMixed = false;
    this.vehicleNew_Vet = [];
  } else if (this.transportNew_Obj.transport_type === 'Passenger') {
    this.isPeople = true;
    this.isCargoMix = false;
    this.isMixed = false;
    this.vehicleNew_Vet = [];
  } else if (this.transportNew_Obj.transport_type === 'Mixed') {
    this.isMixed = true;
    this.isPeople = false;
    this.isCargoMix = false;
    this.vehicleNew_Vet = [];
  }
  this.initials = this.transportNew_Obj.initials;
  this.nameBusinessCategory = 'CAT_' + this.transportNew_Obj.name_transport + '-' + this.initials;
  this.findVehiclesByTransport();
  this.onChangeGetWeightTransp();
}

onChangeGetWeightTransp() {
  let unityWeight: String;
  this.weightUnityVehicle_max = 'MAX';
  this.peopleMax = 0;
  this.weightVehicleMaxNew = 0.0;
  this.weightUnityVehicle_max = '0';
  this.unityWeightValue_S = '';
  this.unityWeightKey_Index = 0;

  for (const a in this.transportNew_Obj.unity_weight) {
    unityWeight =  this.transportNew_Obj.unity_weight[a];
  }
  console.log(' ABC ', this.transportNew_Obj.weight_max + ' ' + unityWeight);
  this.weightUnityTransport_max = this.transportNew_Obj.weight_max + ' ' + unityWeight;
}

// FIELD VEHICLE ---------------------//
removeVehicle(vehicleEditSelect: VehicleModel) {
  const error = 'It is not possible to delete a single vehicle that is registered';

  if ( this.vehicleNew_Vet.length > 1) {
    const vehicleObj = this.vehicleNew_Vet.findIndex(vehicle => vehicle.category_vehicle === vehicleEditSelect.category_vehicle);
    this.vehicleNew_Vet.splice(vehicleObj, 1);
    this.calcRuleInstanceDeleteWeight(vehicleEditSelect);
  } else if ( this.vehicleNew_Vet.length === 1) {
    this.showNotification('bottom', 'center', error, 'error');
  }
}

addVehicle() {
  let statusVehicle = false;
  if ( this.vehicleNew_Vet.length >= 1) {
    this.vehicleNew_Vet.forEach( (vehicleObj) => {
      if (vehicleObj.category_vehicle === this.vehicleNew_Obj.category_vehicle) {
        statusVehicle = true;
      }
    });
  }

  if ( statusVehicle === false ) {
    console.log('VEHICLE_001', this.vehicleNew_Obj);
    this.vehicleNew_Vet.push(this.vehicleNew_Obj);
    this.calcRuleInstanceAddWeight(this.vehicleNew_Obj);
  } else {
    this.transactionOrchestrator(null, 'ValidationII');
  }
}

// ------------------------------------------------------------------------//
// CALC WEIGHT MAX
// ------------------------------------------------------------------------//

calcRuleInstanceAddWeight(vehicleObjSelect: VehicleModel) {
  let unityWeight_key: number;
  let unityWeight_value: string;

  // OBJECT-SELECT => CONVERT MAP TO ARRAY -> UNITYWEIGHT
  // tslint:disable-next-line:forin
  for (const a in vehicleObjSelect.unity_weight) {
    unityWeight_key = Number(a);
    unityWeight_value = vehicleObjSelect.unity_weight[a];
  }

  console.log('unityWeight_key KEY ', unityWeight_key);
  console.log('unityWeight_value VALUE ', unityWeight_value);
  console.log('Object 1 ', vehicleObjSelect.weight_max);
  console.log('Object 1 ', this.weightUnityVehicle_max);

  if ( ( vehicleObjSelect.transport_type === 'Cargo') || ( vehicleObjSelect.transport_type === 'Mixed')) {
    if (this.weightVehicleMaxNew === 0) {
      this.weightVehicleMaxNew = vehicleObjSelect.weight_max;
      this.unityWeightValue_S = unityWeight_value;
      this.unityWeightKey_Index = unityWeight_key;
    } else if (vehicleObjSelect.weight_max > this.weightVehicleMaxNew) {
        if (unityWeight_key === this.unityWeightKey_Index) {
          this.weightVehicleMaxNew = vehicleObjSelect.weight_max;
        } else if (unityWeight_key > this.unityWeightKey_Index) {
            this.weightVehicleMaxNew = vehicleObjSelect.weight_max;
            this.unityWeightValue_S = unityWeight_value;
            this.unityWeightKey_Index = unityWeight_key;
        }
    } else if (vehicleObjSelect.weight_max < this.weightVehicleMaxNew) {
        if (unityWeight_key > this.unityWeightKey_Index) {
          this.weightVehicleMaxNew = vehicleObjSelect.weight_max;
          this.unityWeightValue_S = unityWeight_value;
          this.unityWeightKey_Index = unityWeight_key;
        }
      }
    }
    if ( vehicleObjSelect.transport_type === 'Passenger') {
      if ( this.peopleMax === 0) {
        this.peopleMax = vehicleObjSelect.people_max;
      } else if ( vehicleObjSelect.people_max > this.peopleMax) {
          this.peopleMax = vehicleObjSelect.people_max;
      }
    }
    this.weightUnityVehicle_max = this.weightVehicleMaxNew + ' ' + this.unityWeightValue_S;
}

getWeightUnitMax(): weightUnitI[] {

  // Array: Weight + Unit = Total
  const weightUnit_L: weightUnitI[] = [];
  // Array: Unit Key Only
  const keyUnit_L: number[] = [];
  // Array: Unit Key Only
  const weightUnitMax_L: weightUnitI[] = [];

  let weightUnitObj = {} as weightUnitI;
  let unityWeight_key: number;
  let unityWeight_value: string;

  // (1) Array Generation
  this.vehicleNew_Vet.forEach(function(vehicleObj) {
    weightUnitObj = {} as weightUnitI;
    // tslint:disable-next-line:forin
    for (const a in vehicleObj.unity_weight) {
      unityWeight_key = Number(a);
      unityWeight_value = vehicleObj.unity_weight[a];
    }
    weightUnitObj.weight_max = vehicleObj.weight_max;
    weightUnitObj.people_max = vehicleObj.people_max;
    weightUnitObj.unit = unityWeight_value;
    weightUnitObj.index = unityWeight_key;
    // (1) Key Unity Array
    keyUnit_L.push(unityWeight_key);
    // (1) WeightUnityTotal Array
    weightUnit_L.push(weightUnitObj);
  });

  // (2) MAX Value in keyUnit_L Array
  let keyUnitMax = Math.max(...keyUnit_L);
  let weightMax = 0;
  let peopleMax = 0;
  let valueUnityMax = '';

  console.log(' weightUnit_L() ', weightUnit_L);

  // (3) Find Weiht + Unity
  weightUnit_L.forEach(function (weightObj) {
    if (weightObj.index === keyUnitMax) {
      if ( weightMax === 0) {
        weightMax = weightObj.weight_max;
        valueUnityMax = weightObj.unit;
      }
      if (weightObj.weight_max > weightMax) {
          weightMax = weightObj.weight_max;
          valueUnityMax = weightObj.unit;
      }
    }
    if ( peopleMax === 0) {
      peopleMax = weightObj.people_max;
    }
    if (weightObj.people_max > peopleMax) {
      peopleMax = weightObj.people_max;
    }
  })
  // (4) Result Add in Array
  const weightMaxObj = {} as weightUnitI;
  weightMaxObj.weight_max = weightMax;
  weightMaxObj.people_max = peopleMax;
  weightMaxObj.unit = valueUnityMax;
  weightMaxObj.index = keyUnitMax;
  weightUnitMax_L.push(weightMaxObj);
  return weightUnitMax_L;
}

calcRuleInstanceDeleteWeight(vehicleObjSelect: VehicleModel) {
  let unityWeight_key: number;
  let unityWeight_value: string;
  let weightUnitMax_L: weightUnitI[] = [];

  let weightMaxNew_Local: number;
  let peopleMaxNew_Local: number;
  let unityWeightValue_S_Local: string;
  let unityWeightKey_Index_Local: number;

  // OBJECT-SELECT => CONVERT MAP TO ARRAY -> UNITYWEIGHT
  // tslint:disable-next-line:forin
  for (const a in vehicleObjSelect.unity_weight) {
    unityWeight_key = Number(a);
    unityWeight_value = vehicleObjSelect.unity_weight[a];
  }

  if ( ( vehicleObjSelect.transport_type === 'Cargo') || ( vehicleObjSelect.transport_type === 'Mixed')) {
    if ((this.weightVehicleMaxNew === vehicleObjSelect.weight_max) && (unityWeight_key === this.unityWeightKey_Index)) {
      weightUnitMax_L = this.getWeightUnitMax();
      weightUnitMax_L.forEach(function (weightUnitObj) {
        weightMaxNew_Local = weightUnitObj.weight_max;
        unityWeightValue_S_Local = weightUnitObj.unit;
        unityWeightKey_Index_Local = weightUnitObj.index;
        peopleMaxNew_Local = weightUnitObj.people_max;
      })
      this.peopleMax = peopleMaxNew_Local;
      this.weightVehicleMaxNew = weightMaxNew_Local;
      this.weightUnityVehicle_max = weightMaxNew_Local + ' ' + this.unityWeightValue_S;
      this.unityWeightValue_S = unityWeightValue_S_Local;
      this.unityWeightKey_Index = unityWeightKey_Index_Local;
    }
  } else {
    weightUnitMax_L = this.getWeightUnitMax();
    weightUnitMax_L.forEach(function (weightUnitObj) {
      peopleMaxNew_Local = weightUnitObj.people_max;
    })
    this.peopleMax = peopleMaxNew_Local;
  }
}


// ------------------------------------------------------------------------//
// NOTIFICATION :: MENSAGEM
// ------------------------------------------------------------------------//

transactionOrchestrator(event: any, type: String) {
  let msgTransaction = '' as  String;
  switch (type) {
    case 'Update': {
      msgTransaction = 'Update Success';
      type = 'success';
      this.functionRedirectToCategories();
      break;
    }
    case 'Save': {
      msgTransaction = 'Register Success';
      type = 'success';
      this.functionRedirectToRuleBRE();
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
  this.showNotification('bottom', 'center', msgTransaction, type);
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

  functionRedirectToRuleBRE() {
    const msg = 'Deseja definir as regras de negocio BRE para a categoria cadastrada?';
    this.confirmationDialogService.confirm('Regras Negócio BRE', msg).then((result) => {
      if ( result === true ) {
        this.categoryData.categoryruleData = this.categoryObjEntity;
        this.router.navigate(['/roadway-new']);
      } else {
        this.router.navigate(['/category-view']);
      }
    })
    .catch(() => alert('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'));
  }

}
