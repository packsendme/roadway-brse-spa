import { BodyWorkModel } from 'app/model/body-work-model';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { NgForm } from '@angular/forms';
import { BodyWorkService } from 'app/service/body-work.service';

@Component({
  selector: 'app-bodywork',
  templateUrl: './bodywork.component.html',
  styleUrls: ['./bodywork.component.css']
})
export class BodyworkComponent implements OnInit {

  // List Another Requests
  bodyworkes: BodyWorkModel[];

    // Screen Option
    bodyworkOne_Obj = {} as BodyWorkModel;
    statusDelete_btn = true;
    statusNew_btn = true;

  constructor(private bodyworkService: BodyWorkService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.findBodyworks();
   }

   //--------- REQUESTs - INTERNAL ---------------------------------------//

   findBodyworks() {
    let bodyworksVet: BodyWorkModel[] = [];
    this.bodyworkService.getBodyWork().subscribe((bodyworksData: Response) =>{
      const bodyworksStr = JSON.stringify(bodyworksData.body);
      JSON.parse(bodyworksStr, function (key, value) {
        if (key === 'bodies') {
          bodyworksVet = value;
          return value;
        } else {
          return value;
        }
      });
      this.bodyworkes = bodyworksVet;
    });
  }

  // --------- OPERATION TRANSACTION - CRUD ---------------------------------------//

  newRecord(event: any){
    event.resetForm(event);
    this.bodyworkOne_Obj = {} as BodyWorkModel;
    this.statusNew_btn = true;
    this.statusDelete_btn = true;
  }

  saveEditBodyWork(event: any) {
    // Transaction Save
    if (this.bodyworkOne_Obj.id == null) {
      this.bodyworkService.postBodyWork(this.bodyworkOne_Obj).subscribe({
        next: data => this.transactionOrchestrator(event, 'Save'),
        error: error => this.showNotification('bottom','center', error, 'error')
      });
    } else if (this.bodyworkOne_Obj.id != null) {
      this.bodyworkService.putBodyWork(this.bodyworkOne_Obj).subscribe({
        next: data => this.transactionOrchestrator(event, 'Update'),
        error: error => this.showNotification('bottom','center', error, 'error')
      });
    }
    this.statusDelete_btn = true;
  }

  deleteBodyWork(event: any){
    this.statusDelete_btn = true;
    this.statusNew_btn = true;
    // Transaction Delete
    if (this.bodyworkOne_Obj.id != null) {
      this.bodyworkService.deleteBodyWork(this.bodyworkOne_Obj).subscribe({
        next: data => this.transactionOrchestrator(event, 'Delete'),
        error: error => this.showNotification('bottom', 'center', error, 'error')
      });
    }
  }

// --------------------------------------------------------------------------------//

selectLocation(event: any, vehicleSelect: any) {
  this.statusDelete_btn = false;
  this.statusNew_btn = false;
  this.bodyworkOne_Obj = vehicleSelect;
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
    this.findBodyworks()
    this.showNotification('bottom', 'center', msgTransaction, 'success')
    event.resetForm(event);
    this.bodyworkOne_Obj = {} as BodyWorkModel;
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
