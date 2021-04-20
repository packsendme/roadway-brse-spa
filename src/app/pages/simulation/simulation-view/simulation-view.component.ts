import { SimulationResponseModel } from './../../../model/simulation-response-model';
import { SimulationService } from './../../../service/simulation.service';
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { DataTO } from 'app/model/dataTO';
import { SimulationRequestModel } from 'app/model/simulation-request-model';

@Component({
  selector: 'app-simulation-view',
  templateUrl: './simulation-view.component.html',
  styleUrls: ['./simulation-view.component.css']
})
export class SimulationViewComponent implements OnInit {

  simulationResponseL: SimulationResponseModel[];
  simulationResponse_obj = {} as SimulationResponseModel;
  isDisabled = true;

  constructor(
    private simulationService: SimulationService,
    private simulationTO: DataTO,
    private toastr: ToastrService,
    private router: Router) { }

  ngOnInit(): void {
    this.findSimulation();
    this.simulationTO.simulationResponseData = null;
  }

    // --------- REQUESTs - EXTERNAL ---------------------------------------//

    findSimulation() {
      let simulationVet: SimulationResponseModel[] = [];
      this.simulationService.get().subscribe((simulationData: Response) => {
        const simulationStr = JSON.stringify(simulationData.body);
        JSON.parse(simulationStr, function (key, value) {
          if (key === 'simulationResponseL') {
            simulationVet = value;
            return value;
          } else {
            return value;
          }
        });
        this.simulationResponseL = simulationVet;
      });
    }

// --------- OPERATION TRANSACTION - CRUD ---------------------------------------//

select(event: any, simulationSelect: any) {
  this.isDisabled = false;
  this.simulationResponse_obj = simulationSelect;
}
  new() {
    this.simulationTO.simulationResponseData = null;
    this.router.navigate(['/simulation-crud']);
  }

  view() {
    this.simulationTO.simulationResponseData = null;
    this.simulationTO.simulationResponseData = this.simulationResponse_obj;
    this.router.navigate(['/simulation-crud']);
  }
}
