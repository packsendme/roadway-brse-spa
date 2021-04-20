import { TransportTypeService } from 'app/service/transport-type.service';
import { TransportTypeModel } from 'app/model/transport-type-model';
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { NgForm } from '@angular/forms';
import { InitialsService } from 'app/service/initials.service';
import { InitialsModel } from 'app/model/initials-model';
import { DataTO } from 'app/model/dataTO';
import { ConfirmationDialogService } from 'app/service/confirmation-dialog.service';
import { Router } from '@angular/router';
import { TariffPlanModel } from 'app/model/tariff-plan-model';
import { UnityMeasurementService } from 'app/service/unity-measurement.service';
import { UnityMeasurementModel } from 'app/model/unity-measurement-model';

@Component({
  selector: 'app-transport',
  templateUrl: './transport-crud.component.html',
  styleUrls: ['./transport-crud.component.css']
})
export class TransportCrudComponent implements OnInit {

  // List Another Requests
  transporties: TransportTypeModel[];
  initialies: InitialsModel[];
  unityMeasurements: UnityMeasurementModel[];

  // Screen Option
  transportiesOne_Obj = {} as TransportTypeModel;
  tariffPlan = {} as TariffPlanModel;
  isDisabled = false;
  viewRestrictionS: String = null;
  viewRestriction = true;
  titlePage: string;
  vlrDefault = 0.00;

  unityWeight = '';
  unityWeight_View = new Map<string, string>();
  unityWeight_M = new Map<string, string>();


  constructor(
    private transportService: TransportTypeService,
    private initialsService: InitialsService,
    private toastr: ToastrService,
    private unityMeasurementService: UnityMeasurementService,
    private transportTO: DataTO,
    private confirmationDialogService: ConfirmationDialogService,
    private router: Router) {
      if ( this.transportTO.transportData != null ) {
        this.transportiesOne_Obj = transportTO.transportData;
        this.titlePage = 'Categoria de Transporte - Edit';
        this.isDisabled = false;
        this.tariffPlan = transportTO.transportData.tariffPlan;
        // tslint:disable-next-line:forin
        for (const a in this.transportiesOne_Obj.unity_weight) {
          this.unityWeight =  this.transportiesOne_Obj.unity_weight[a];
        }
        if (this.transportiesOne_Obj.restriction === true) {
          this.viewRestrictionS =  'yes';
          this.toggleDisplayRestriction();
        } else {
          this.viewRestrictionS =  'no';
        }
      } else {
         this.transportiesOne_Obj = {} as TransportTypeModel;
        this.titlePage = 'Categoria de Transporte - Save';
        this.isDisabled = true;
      }
    }

  ngOnInit(): void {
    this.findTransporties();
    this.findInitialies();
    this.findUnityMeasurement();
   }

// --------- REQUESTs - EXTERNAL ---------------------------------------//

findTransporties() {
  let transportiesVet: TransportTypeModel [] = [];
  this.transportService.get().subscribe((transportTypeData: Response) => {
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
  });
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

findInitialies() {
  let initialiesVet: InitialsModel [] = [];
  this.initialsService.get().subscribe((initialiesData: Response) => {
    const initialsDataStr = JSON.stringify(initialiesData.body);
    JSON.parse(initialsDataStr, function (key, value) {
      if (key === 'initials') {
        initialiesVet = value;
        return value;
      } else {
         return value;
      }
    });
    this.initialies = initialiesVet;
  });
}

getUnityWeightByMap(): any {
  const unityWeightLocal_M = new Map<string, string>();
  let key = this.unityWeight_View.get(this.unityWeight);
  let value = '';
  console.log('KEY ', key);
  if (key === undefined) {
    key = '0';
    value = 'undefined'
  } else {
    value = this.unityWeight;
  }
  unityWeightLocal_M.set(key, value);
  const weightMapToArray = {};
  // tslint:disable-next-line:no-shadowed-variable
  unityWeightLocal_M.forEach((val: string, key: string) => {
    weightMapToArray[key] = val;
  });
  return weightMapToArray;
}
// --------- OPERATION TRANSACTION - CRUD ---------------------------------------//

  validateSave(event: any) {
    let msg: string;
    let statusSave = false;

    if ((this.transportiesOne_Obj.name_transport) && (this.transportiesOne_Obj.initials)
     && (this.transportiesOne_Obj.transport_type) && (this.viewRestrictionS !== null)) {
      if ((this.viewRestrictionS === 'yes') && (!this.unityWeight) ||
        (this.transportiesOne_Obj.weight_max === this.vlrDefault) ||
        (this.transportiesOne_Obj.lengthDimension_max === this.vlrDefault) ||
        (this.transportiesOne_Obj.widthDimension_max === this.vlrDefault) ||
        (this.transportiesOne_Obj.heightDimension_max === this.vlrDefault)) {
          statusSave = false;
          msg = 'No item restriçao de transporte existem valores igual a 0.00. Favor alterar para adicionar valor MAX';
      }
      if ((this.tariffPlan.dimension_plan === true) || (this.tariffPlan.distance_plan === true) ||
       (this.tariffPlan.antt_plan === true) && (this.tariffPlan.fragile_plan === true) ||
       (this.tariffPlan.fuelconsumption_plan === true) || (this.tariffPlan.persishable_plan === true) ||
       (this.tariffPlan.reshipping_plan === true) || (this.tariffPlan.tolls_plan === true) ||
       (this.tariffPlan.weight_plan === true) || (this.tariffPlan.worktime_plan === true)) {
        statusSave = true;
        this.transportiesOne_Obj.tariffPlan = this.tariffPlan;
        this.transportiesOne_Obj.unity_weight = this.getUnityWeightByMap();
       }
       else{
        statusSave = false;
        msg = 'Verifique os campos obrigatorios';
       }
    } else {
      msg = 'Verifique os campos obrigatorios';
      statusSave = false;
    }

    if (statusSave === true) {
      msg = 'Desejar salvar o tipo de transporte?';
      this.save(event, msg);
    } else {
      this.showNotification('bottom', 'center', msg, 'error');
    }
  }

  save(event: any, msg: any) {
    // Transaction Save
    this.confirmationDialogService.confirm('Save', msg).then((result) => {
      if ( result === true ) {
        console.log('Save', this.transportiesOne_Obj.unity_weight);
        if (this.transportiesOne_Obj.id == null) {
          this.transportService.post(this.transportiesOne_Obj).subscribe({
            next: data => this.transactionOrchestrator(event, 'Save'),
            error: error => this.showNotification('bottom', 'center', error, 'error')
          });
        } else if (this.transportiesOne_Obj.id != null) {
          this.transportService.put(this.transportiesOne_Obj).subscribe({
            next: data => this.transactionOrchestrator(event, 'Update'),
            error: error => this.showNotification('bottom', 'center', error, 'error')
          });
        }
      }
    })
  }

  delete(event: any) {
    let msg: string;
    if ( this.transportiesOne_Obj.id != null ) {
      msg = 'Confirms the transaction to delete the item from the database?';
      this.confirmationDialogService.confirm('Delete', msg).then((result) => {
        if ( result === true ) {
          // Transaction Delete
          if (this.transportiesOne_Obj.id != null) {
            this.transportService.delete(this.transportiesOne_Obj).subscribe({
              next: data => this.transactionOrchestrator(event, 'Delete'),
              error: error => this.showNotification('bottom', 'center', error, 'error')
            });
          }
        }
      })
      .catch(() => console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'));
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
        this.functionRedirectToTransportView();
        break;
      }
      case 'Save': {
        msgTransaction = 'Register Success';
        type = 'success';
        this.functionRedirectToTransportView();
        break;
      }
      case 'Delete': {
        msgTransaction = 'Delete Success';
        type = 'success';
        this.functionRedirectToTransportView();
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


// TRANSACTION   ---------------------//

toggleDisplayRestriction() {
  console.log('alert', this.viewRestrictionS);
  if (this.viewRestrictionS === 'yes') {
    this.viewRestriction = false;
    this.transportiesOne_Obj.restriction = true;
  } else if (this.viewRestrictionS === 'no') {
    this.viewRestriction = true;
    this.transportiesOne_Obj.restriction = false;
    this.transportiesOne_Obj.weight_max = this.vlrDefault;
    this.transportiesOne_Obj.unity_weight = null;
    this.transportiesOne_Obj.lengthDimension_max = this.vlrDefault;
    this.transportiesOne_Obj.widthDimension_max = this.vlrDefault;
    this.transportiesOne_Obj.heightDimension_max = this.vlrDefault;
  }
}


  toggleDisplay() {
    console.log('toggleDisplay', this.transportiesOne_Obj.transport_type);
    if (this.transportiesOne_Obj.transport_type === 'Cargo') {
      this.transportiesOne_Obj.identifier = "Only";
    } else if (this.transportiesOne_Obj.transport_type === 'Passenger') {
      this.transportiesOne_Obj.identifier = "Only";
    } else if (this.transportiesOne_Obj.transport_type === 'Mixed') {
      this.transportiesOne_Obj.identifier = "Mix";
    }
  }

// OPERATION REDIRECT  ---------------------//

  functionRedirectToTransportView() {
    this.router.navigate(['/transport-view']);
  }

  functionRedirectToInitials() {
    this.router.navigate(['/initials-crud']);
  }


}
