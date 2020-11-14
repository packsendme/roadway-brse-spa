import { Component, OnInit } from '@angular/core';
import { TransportTypeModel } from 'app/model/transport-type-model';
import { InitialsService } from 'app/service/initials.service';
import { TransportTypeService } from 'app/service/transport-type.service';

@Component({
  selector: 'app-transport-view',
  templateUrl: './transport-view.component.html',
  styleUrls: ['./transport-view.component.css']
})
export class TransportViewComponent implements OnInit {

  isDisabled = false;
  transportiesOne_O transportiesOne_Obj = {} as TransportTypeModel;bj

  // List Another Requests
  transporties: TransportTypeModel[];

  constructor(
    private transportService: TransportTypeService,
    private initialsService: InitialsService) { }

  ngOnInit(): void {
  }

  //--------- REQUESTs - EXTERNAL ---------------------------------------//

findTransporties() {
  let transportiesVet: TransportTypeModel [] = [];
  this.transportService.getTransportType().subscribe((transportTypeData: Response) => {
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

selectTransport(event: any, transportSelect: any) {
  this.isDisabled = true;
  this.transportiesOne_Obj = transportSelect;
}

}
