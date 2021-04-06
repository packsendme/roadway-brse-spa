import { CostsRoadwayModel } from './../../../model/costs-roadway-model';
import { TransportTypeService } from 'app/service/transport-type.service';
import { SimulationRequestModel } from 'app/model/simulation-request-model';
import { SimulationService } from './../../../service/simulation.service';
import { Component, OnInit } from '@angular/core';
import { ConfirmationDialogService } from 'app/service/confirmation-dialog.service';
import { ToastrService } from 'ngx-toastr';
import { TransportTypeModel } from 'app/model/transport-type-model';
import { SimulationResponseModel } from 'app/model/simulation-response-model';


@Component({
  selector: 'app-simulation-crud',
  templateUrl: './simulation-crud.component.html',
  styleUrls: ['./simulation-crud.component.css']
})
export class SimulationCrudComponent implements OnInit {

  simulationRequest_Obj = {} as SimulationRequestModel;
  simulationResponse_Obj = {} as SimulationResponseModel;

  transporties: TransportTypeModel[];
  viewPeople = false;
  viewTransports = false;

  unityWeightL: string[];

  constructor(
    private simulationRequestService: SimulationService,
    private transportService: TransportTypeService,
    private toastr: ToastrService,
    private confirmationDialogService: ConfirmationDialogService
  ) { }

  ngOnInit(): void {
    this.unityWeightL = ['Grama','Kilograma','Tonelada'];
    this.findTransporties();
  }

// ------------------------------------------------------------------------//
// REQUESTs - EXTERNAL
// ------------------------------------------------------------------------//

prepareSimulation(event: any) {
  let statusSave = true;
  let msg: string;

  if (this.simulationRequest_Obj.type_transport === 'Transporte Pessoas') {
    if ((!this.simulationRequest_Obj.address_destination) || (!this.simulationRequest_Obj.address_origin) ||
    (this.simulationRequest_Obj.people === 0)) {
      statusSave = false;
    }
  } else if (this.simulationRequest_Obj.type_transport === 'Transporte Carga Unitário') {
    if ((!this.simulationRequest_Obj.address_destination) || (!this.simulationRequest_Obj.address_origin) &&
        (!this.simulationRequest_Obj.weight_max) || (!this.simulationRequest_Obj.unity_weight) ||
        (!this.simulationRequest_Obj.height_max) || (!this.simulationRequest_Obj.width_max) ||
        (!this.simulationRequest_Obj.length_max)) {
          statusSave = false;
    }
  } else {
    statusSave = false;
  }

  if (statusSave === true) {
    msg = 'Confirma simulaçao?';
    this.simulationRequest_Obj.delivery_type = 'NDA';
    this.findSimulation(msg);
  } else {
    msg = 'Verifique os campos obrigatorios';
    this.showNotification('bottom', 'center', msg, 'error');
  }
}

findSimulation(msg: any) {
  this.confirmationDialogService.confirm('Save', msg).then((result) => {
    if ( result === true ) {
      this.simulationRequestService.post(this.simulationRequest_Obj).subscribe({
        next: data => this.funcParserSimulation(data),
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
  console.log('PARSER-simulationData '+ simulationData.body);

  if(simulationData.body === null){
    console.log('IS NULL-simulationData '+ simulationData.body);

  }

  const simulationTypeDataStr = JSON.stringify(simulationData.body);
  JSON.parse(simulationTypeDataStr, function (key, value) {
    if (key === 'responseData') {
      costsRoadwayVet = value;
      return value;
    } else {
       return value;
    }
  });
  this.simulationResponse_Obj.responseData = costsRoadwayVet;
  console.log('PARSER-SIMULATION '+ this.simulationResponse_Obj.responseData);
}


// ------------------------------------------------------------------------//
// CHANGE FIELD
// ------------------------------------------------------------------------//

fieldByTransportType() {
  if (this.simulationRequest_Obj.type_transport === 'Transporte Pessoas') {
    this.viewPeople = true;
    this.viewTransports = false;
  } else {
    this.viewTransports = true;
    this.viewPeople = false;
  }
}


// ------------------------------------------------------------------------//
// NOTIFICATION MESSAGE
// ------------------------------------------------------------------------//

transactionOrchestrator(event: any, type: String) {
  let msgTransaction = '' as  String;
  switch (type) {
    case 'Save': {
      msgTransaction = 'Simulation Success';
      type = 'success';
      break;
    }
    case 'Validation': {
      msgTransaction = 'Check the required fields';
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
        '<span data-notify="icon" class="nc-icon nc-bell-55"></span><span data-notify="message">'+ msg +'</span>','',
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
        '<span data-notify="icon" class="nc-icon nc-bell-55"></span><span data-notify="message">'+ msg +'</span>','',
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
