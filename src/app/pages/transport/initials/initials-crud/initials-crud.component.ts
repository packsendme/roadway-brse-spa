import { InitialsService } from './../../../../service/initials.service';
import { InitialsModel } from './../../../../model/initials-model';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationDialogService } from 'app/service/confirmation-dialog.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-initials-crud',
  templateUrl: './initials-crud.component.html',
  styleUrls: ['./initials-crud.component.css']
})
export class InitialsCrudComponent implements OnInit {


   // List Another Requests
   initialies: InitialsModel[];
   initialName: String = '';

  // Screen Option
  initialsOne_Obj = {} as InitialsModel;
  isDisabled = true;

  constructor(
    private initialsService: InitialsService,
    private router: Router,
    private confirmationDialogService: ConfirmationDialogService,
    private toastr: ToastrService) { }

  ngOnInit(): void {
    this.findInitialies();
  }

  // --------- REQUESTs - EXTERNAL ---------------------------------------//

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

  // --------- OPERATION TRANSACTION - CRUD ---------------------------------------//

  validateSave(event: any) {
    let msg: string;
    if (this.initialName) {
        msg = 'Confirms the transaction to save the item in the database?';
        this.save(event, msg);
    } else {
      msg = 'Check the required fields';
      this.showNotification('bottom', 'center', msg, 'error');
    }
  }

  save(event: any, msg: any) {
    // Transaction Save
    this.confirmationDialogService.confirm('Save', msg).then((result) => {
      if ( result === true ) {
        this.initialsOne_Obj.name = this.initialName;
        if (this.initialsOne_Obj.id == null) {
          this.initialsService.post(this.initialsOne_Obj).subscribe({
            next: data => this.transactionOrchestrator(event, 'Save'),
            error: error => this.showNotification('bottom', 'center', error, 'error')
          });
        } else if (this.initialsOne_Obj.id != null) {
          this.initialsOne_Obj.name = this.initialName;
          console.log(' LOGS ', this.initialsOne_Obj.name);
          this.initialsService.put(this.initialsOne_Obj).subscribe({
            next: data => this.transactionOrchestrator(event, 'Update'),
            error: error => this.showNotification('bottom', 'center', error, 'error')
          });
        }
      }
    })
  }

  delete(event: any) {
    let msg: string;
    if ( this.initialsOne_Obj != null ) {
      msg = 'Confirms the transaction to delete the item from the database?';
      this.confirmationDialogService.confirm('Delete', msg).then((result) => {
        if ( result === true ) {
          // Transaction Delete
          if (this.initialsOne_Obj.id != null) {
            this.initialsService.delete(this.initialsOne_Obj).subscribe({
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

selectInitial(event: any, initialSelect: InitialsModel) {
  this.isDisabled = false;
  this.initialsOne_Obj = initialSelect;
  this.initialName = initialSelect.name;
}

transactionOrchestrator(event: any, type: String) {
    let msgTransaction = '' as  String;
    console.log('Save Teste', type );
    switch (type) {
      case 'Save': {
        msgTransaction = 'Register Success';
        this.functionRedirectToTransport();
        break;
      }
      // tslint:disable-next-line:no-switch-case-fall-through
      case 'Update': {
        msgTransaction = 'Update Success';
        this.functionRedirectToTransport();
        break;
      }
      case 'Delete': {
        msgTransaction = 'Delete Success';
        this.functionRedirectToTransport();
        break;
      }
    }
    this.showNotification('bottom', 'center', msgTransaction, 'success')
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

  functionRedirectToTransport() {
    this.router.navigate(['/transport-crud']);
  }
}
