import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { NgForm, FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { BodyworkModel } from 'app/model/bodywork-model';
import { BodyworkService } from 'app/service/bodywork.service';
import { DataTO } from 'app/model/dataTO';
import { Router } from '@angular/router';
import { ConfirmationDialogService } from 'app/service/confirmation-dialog.service';

@Component({
  selector: 'app-bodywork',
  templateUrl: './bodywork-crud.component.html',
  styleUrls: ['./bodywork-crud.component.css']
})
export class BodyworkCrudComponent implements OnInit {

  // List Another Requests
  bodyworkes: BodyworkModel[];

  // Screen Option
  bodyworkOne_Obj = {} as BodyworkModel;
  isDisabled = true;
  nameBodywork: String = '';

  constructor(
    private bodyworkService: BodyworkService,
    private router: Router,
    private confirmationDialogService: ConfirmationDialogService,
    private toastr: ToastrService) { }

  ngOnInit(): void {
    this.findBodywork();
  }

// --------- REQUESTs - EXTERNAL ---------------------------------------//

  findBodywork() {
    let bodyworkVet: BodyworkModel[] = [];
    this.bodyworkService.getBodyWork().subscribe((bodyWorkData: Response) => {
    const bodyWorkStr = JSON.stringify(bodyWorkData.body);
    JSON.parse(bodyWorkStr, function (key, value) {
      if (key === 'bodies') {
        bodyworkVet = value;
        return value;
      } else {
          return value;
        }
      });
      this.bodyworkes = bodyworkVet;
    });
  }

  // --------- OPERATION TRANSACTION - CRUD ---------------------------------------//
  validateSave(event: any) {
    let msg: string;
    if (this.nameBodywork) {
      if (this.nameBodywork.length < 5) {
        msg = 'Name Bodywork must be 5 min - 30 max characters long';
        this.showNotification('bottom', 'center', msg, 'error');
      } else {
        msg = 'Confirms the transaction to save the item in the database?';
        this.save(event, msg);
      }
    } else {
      msg = 'Check the required fields';
      this.showNotification('bottom', 'center', msg, 'error');
    }
  }


  save(event: any, msg: any) {
    this.confirmationDialogService.confirm('Save', msg).then((result) => {
      if ( result === true ) {
        this.bodyworkOne_Obj.bodyWork = this.nameBodywork;
        // Transaction Save
        if (this.bodyworkOne_Obj.id == null) {
          this.bodyworkService.postBodyWork(this.bodyworkOne_Obj).subscribe({
            next: data => this.transactionOrchestrator(event, 'Save'),
            error: error => this.showNotification('bottom', 'center', error, 'error')
          });
        } else if (this.bodyworkOne_Obj.id != null) {
          this.bodyworkService.putBodyWork(this.bodyworkOne_Obj).subscribe({
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
    if ( this.bodyworkOne_Obj != null ) {
      this.confirmationDialogService.confirm('Delete', msg).then((result) => {
        if ( result === true ) {
          // Transaction Delete
          if (this.bodyworkOne_Obj.id != null) {
            this.bodyworkService.deleteBodyWork(this.bodyworkOne_Obj).subscribe({
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

selectBodyWork(event: any, bodyworkSelect: BodyworkModel) {
  this.isDisabled = false;
  this.bodyworkOne_Obj = bodyworkSelect;
  this.nameBodywork = bodyworkSelect.bodyWork;
}

  transactionOrchestrator(event: any, type: String) {
    let msgTransaction = '' as  String;
    switch (type) {
      case 'Save': {
        msgTransaction = 'Register Success';
        this.functionRedirectToView();
        break;
      }
      case 'Update': {
        msgTransaction = 'Update Success';
        this.functionRedirectToView();
        break;
      }
      case 'Delete': {
        msgTransaction = 'Delete Success';
        this.functionRedirectToView();
        break;
      }
    }

    this.showNotification('bottom', 'center', msgTransaction, 'success')
    event.resetForm(event);
    this.bodyworkOne_Obj = {} as BodyworkModel;
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


  // ------------------------------------------------------------------------//
// OPERATION REDIRECT
// ------------------------------------------------------------------------//

  functionRedirectToView() {
    this.router.navigate(['/vehicle-crud']);
  }
}
