import { TransportTypeService } from 'app/service/transport-type.service';
import { TransportTypeModel } from 'app/model/transport-type-model';
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-transport',
  templateUrl: './transport.component.html',
  styleUrls: ['./transport.component.css']
})
export class TransportComponent implements OnInit {

  // List Another Requests
  transporties: TransportTypeModel[];

  // Screen Option
  transportiesOne_Obj = {} as TransportTypeModel;
  statusDelete_btn = true;
  statusNew_btn = true;

  constructor(private transportService: TransportTypeService,
    private toastr: ToastrService) { }

  ngOnInit(): void {
    this.findTransporties();
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

// --------- OPERATION TRANSACTION - CRUD ---------------------------------------//

  newRecord(event: any) {
    event.resetForm(event);
    this.transportiesOne_Obj = {} as TransportTypeModel;
    this.statusNew_btn = true;
    this.statusDelete_btn = true;
  }

  saveEditTransport(event: any) {
    // Transaction Save
    if (this.transportiesOne_Obj.id == null) {
      this.transportService.postTransportType(this.transportiesOne_Obj).subscribe({
        next: data => this.transactionOrchestrator(event, 'Save'),
        error: error => this.showNotification('bottom','center', error, 'error')
      });
    } else if (this.transportiesOne_Obj.id != null) {
      this.transportService.putTransportType(this.transportiesOne_Obj).subscribe({
        next: data => this.transactionOrchestrator(event, 'Update'),
        error: error => this.showNotification('bottom','center', error, 'error')
      });
    }
    this.statusDelete_btn = true;
  }

  deleteTransport(event: any){
    console.log(' deleteTransport ');
    this.statusDelete_btn = true;
    this.statusNew_btn = true;
    // Transaction Delete
    if (this.transportiesOne_Obj.id != null) {
      this.transportService.deleteTransportType(this.transportiesOne_Obj).subscribe({
        next: data => this.transactionOrchestrator(event, 'Delete'),
        error: error => this.showNotification('bottom', 'center', error, 'error')
      });
    }
  }

// --------------------------------------------------------------------------------//

selectTransport(event: any, transportSelect: any) {
  this.statusDelete_btn = false;
  this.statusNew_btn = false;
  this.transportiesOne_Obj = transportSelect;
}

transactionOrchestrator(event: any, type: String) {
    let msgTransaction = '' as  String;
    switch (type) {
      case 'Save': {
        msgTransaction = 'Register Success';
      }
      case 'Update': {
        msgTransaction = 'Update Success';
      }
      case 'Delete': {
        msgTransaction = 'Delete Success';
      }
    }
    this.findTransporties()
    this.showNotification('bottom', 'center', msgTransaction, 'success')
    event.resetForm(event);
    this.transportiesOne_Obj = {} as TransportTypeModel;
}

handleClear(f: NgForm){
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

}
