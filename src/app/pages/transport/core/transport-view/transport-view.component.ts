import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataTO } from 'app/model/dataTO';
import { TransportTypeModel } from 'app/model/transport-type-model';
import { ConfirmationDialogService } from 'app/service/confirmation-dialog.service';
import { InitialsService } from 'app/service/initials.service';
import { TransportTypeService } from 'app/service/transport-type.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-transport-view',
  templateUrl: './transport-view.component.html',
  styleUrls: ['./transport-view.component.css']
})
export class TransportViewComponent implements OnInit {

  isDisabled = false;
  transportiesOne_Obj = {} as TransportTypeModel;

  // List Another Requests
  transporties: TransportTypeModel[];

  constructor(
    private transportService: TransportTypeService,
    private toastr: ToastrService,
    private transportTO: DataTO,
    private router: Router) { }

  ngOnInit(): void {
    this.findTransporties();
  }

  //--------- REQUESTs - EXTERNAL ---------------------------------------//

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

  selectTransport(event: any, transportSelect: any) {
    this.isDisabled = true;
    this.transportiesOne_Obj = transportSelect;
  }

// --------- OPERATION TRANSACTION - CRUD ---------------------------------------//

  new() {
    this.transportTO.transportData = null;
    this.router.navigate(['/transport-crud']);
  }

  edit() {
    this.transportTO.transportData = this.transportiesOne_Obj;
    this.router.navigate(['/transport-crud']);
  }

}
