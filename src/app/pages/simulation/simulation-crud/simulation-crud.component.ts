import { CostsRoadwayModel } from './../../../model/costs-roadway-model';
import { TransportTypeService } from 'app/service/transport-type.service';
import { SimulationRequestModel } from 'app/model/simulation-request-model';
import { SimulationService } from './../../../service/simulation.service';
import { AfterViewChecked, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { ConfirmationDialogService } from 'app/service/confirmation-dialog.service';
import { ToastrService } from 'ngx-toastr';
import { TransportTypeModel } from 'app/model/transport-type-model';
import { SimulationResponseModel } from 'app/model/simulation-response-model';
import { DataTO } from 'app/model/dataTO';
import { Router } from '@angular/router';
import { TariffPlanModel } from 'app/model/tariff-plan-model';
import { exit } from 'process';


@Component({
  selector: 'app-simulation-crud',
  templateUrl: './simulation-crud.component.html',
  styleUrls: ['./simulation-crud.component.css']
})
export class SimulationCrudComponent implements OnInit{

  simulationRequest_Obj = {} as SimulationRequestModel;
  simulationResponse_Obj = {} as SimulationResponseModel;
  transport_Obj = {} as TransportTypeModel;
  tariffPlan = {} as TariffPlanModel;

  transporties: TransportTypeModel[];
  viewPeople = false;
  viewDimension = false;
  viewWeight = false;
  isDisabled = true;
  isDisabledDelete = true;
  unityWeightL: string[];
  mesage: string;

  isShow: boolean;
  topPosToStartShowing = 100;

  constructor(
    private simulationRequestService: SimulationService,
    private transportService: TransportTypeService,
    private simulationTO: DataTO,
    private toastr: ToastrService,
    private router: Router,
    private confirmationDialogService: ConfirmationDialogService
  ) {
    if ( this.simulationTO.simulationResponseData != null ) {
      this.simulationRequest_Obj = this.simulationTO.simulationResponseData.requestData;
      this.simulationResponse_Obj = this.simulationTO.simulationResponseData;
      this.isDisabledDelete = false;
      this.fieldByTransportType();
    }
  }

  ngOnInit(): void {
    this.unityWeightL = ['gr','kg','t'];
    this.findTransporties();
  }

  @HostListener('window:scroll')
  checkScroll() {
    const scrollPosition = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    if (scrollPosition >= this.topPosToStartShowing) {
      this.isShow = true;
    } else {
      this.isShow = false;
    }
  }

  // TODO: Cross browsing
  gotoTop() {
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }

// ------------------------------------------------------------------------//
// REQUESTs - EXTERNAL
// ------------------------------------------------------------------------//

prepareSimulation(event: any) {
  let statusSave = true;
  let msg: string;
  this.tariffPlan = this.transport_Obj.tariffPlan;
  if ((!this.simulationRequest_Obj.address_destination) || (!this.simulationRequest_Obj.address_origin)) {
    statusSave = false;
  } else if (this.tariffPlan.weight_plan === true) {
      if ((!this.simulationRequest_Obj.weight_max) || (!this.simulationRequest_Obj.unity_weight)) {
        statusSave = false;
      }
    } else if (this.tariffPlan.dimension_plan === true) {
       if ((!this.simulationRequest_Obj.height_max) || (!this.simulationRequest_Obj.width_max) ||
        (!this.simulationRequest_Obj.length_max)) {
        statusSave = false;
      }
    }
  if (statusSave === true) {
    msg = 'Confirma simulaçao?';
    this.simulationRequest_Obj.delivery_type = 'NDA';
    this.findSimulation();
  } else {
    msg = 'Verifique os campos obrigatorios';
    this.showNotification('bottom', 'center', msg, 'error');
  }
}

findSimulation() {
  this.simulationRequest_Obj.type_transport = this.transport_Obj.transport_type;
  this.simulationRequestService.postSimulationTransport(this.simulationRequest_Obj).subscribe({
    next: data => this.funcParserSimulation(data),
    error: error => this.showNotification('bottom', 'center', error, 'error')
  });
}

saveSimulation() {
  this.confirmationDialogService.confirm('Save', 'Deseja salvar a simulaçao?').then((result) => {
    if ( result === true ) {
      this.simulationResponse_Obj.requestData = this.simulationRequest_Obj;
      this.simulationResponse_Obj.dt_simulation = new Date;
      this.simulationRequestService.post(this.simulationResponse_Obj).subscribe({
        next: data => this.transactionOrchestrator(null, 'Save', 'Register Success'),
        error: error => this.showNotification('bottom', 'center', error, 'error')
      });
    }
  });
}

deleteSimulation() {
  this.confirmationDialogService.confirm('Delete', 'Deseja excluir a simulaçao?').then((result) => {
    if ( result === true ) {
      this.simulationRequestService.delete(this.simulationResponse_Obj).subscribe({
        next: data => this.transactionOrchestrator(null, 'Delete', 'Delete Success'),
        error: error => this.showNotification('bottom', 'center', error, 'error')
      });
    }
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
  });
}

funcParserSimulation(simulationData: Response) {
  let costsRoadwayVet: CostsRoadwayModel[];
  const simulationResponse_Loc = {} as SimulationResponseModel;

  const simulationTypeDataStr = JSON.stringify(simulationData.body);
  JSON.parse(simulationTypeDataStr, function (key, value) {
    if (key === 'responseData') {
      costsRoadwayVet = value;
      return value;
    } else if (key === 'distance_total') {
        simulationResponse_Loc.distance_total = value;
        return value;
    } else if (key === 'duration') {
      simulationResponse_Loc.duration = value;
       return value;
    } else if (key === 'toll_total') {
      simulationResponse_Loc.toll_total = value;
       return value;
    } else{
        return value;
    }
  });
  if (costsRoadwayVet.length === 0) {
    this.confirmationDialogService.confirm('Informaçao', 'Nao foi encontrado um veículo com a capacidade de transporte informada');
  }
  this.gotoTop();
  simulationResponse_Loc.responseData = costsRoadwayVet;
  this.isDisabled = false;
  this.simulationResponse_Obj = simulationResponse_Loc;
}


// ------------------------------------------------------------------------//
// CHANGE FIELD
// ------------------------------------------------------------------------//

  fieldByTransportType() {
    console.log(" STATUS CUSTOS weight ", this.transport_Obj.tariffPlan.weight_plan);
    console.log(" STATUS CUSTOS dimension_plan ", this.transport_Obj.tariffPlan.dimension_plan);
    this.viewPeople = false;
    this.viewDimension = false;
    this.viewWeight = false;

    if ((this.transport_Obj.tariffPlan.weight_plan === true) && (this.transport_Obj.tariffPlan.dimension_plan === true)) {
      this.viewPeople = false;
      this.viewDimension = true;
      this.viewWeight = true;
    }
    if ((this.transport_Obj.tariffPlan.weight_plan === true) && (this.transport_Obj.tariffPlan.dimension_plan === false)) {
        this.viewPeople = false;
        this.viewWeight = true;
        this.viewDimension = false;
    }
    if ((this.transport_Obj.tariffPlan.weight_plan === false) && (this.transport_Obj.tariffPlan.dimension_plan === true)) {
        this.viewPeople = false;
        this.viewWeight = false;
        this.viewDimension = true;
    }
  }

  // ------------------------------------------------------------------------//
  // NOTIFICATION MESSAGE
  // ------------------------------------------------------------------------//

  transactionOrchestrator(event: any, type: String, msgTransaction: String ) {
    switch (type) {
      case 'Save': {
        type = 'success';
        this.view();
        break;
      }
      case 'Validation': {
        type = 'error';
        break;
      }
      case 'Info': {
        type = 'info';
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
      case 'info':
        this.toastr.info(
          '<span data-notify="icon" class="nc-icon nc-bell-55"></span><span data-notify="message">'+ msg +'</span>','', {
            timeOut: 4000,
            enableHtml: true,
            closeButton: true,
            toastClass: 'alert alert-warning alert-with-icon',
            positionClass: 'toast-' + from + '-' + align
          }
        );
      // tslint:disable-next-line:no-switch-case-fall-through
      default:
      break;
    }
  }

  view() {
    this.router.navigate(['/simulation-view']);
  }

}
