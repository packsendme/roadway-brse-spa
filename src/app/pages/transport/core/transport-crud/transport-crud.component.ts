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

@Component({
  selector: 'app-transport',
  templateUrl: './transport-crud.component.html',
  styleUrls: ['./transport-crud.component.css']
})
export class TransportCrudComponent implements OnInit {

  // List Another Requests
  transporties: TransportTypeModel[];
  initialies: InitialsModel[];

  // Screen Option
  transportiesOne_Obj = {} as TransportTypeModel;
    isDisabled = false;
  titlePage: string;

  constructor(
    private transportService: TransportTypeService,
    private initialsService: InitialsService,
    private toastr: ToastrService,
    private transportTO: DataTO,
    private confirmationDialogService: ConfirmationDialogService,
    private router: Router) {
      if ( this.transportTO.transportData != null ) {
        this.transportiesOne_Obj = transportTO.transportData;
        this.titlePage = 'Transport Category - Edit';
        this.isDisabled = false;
      } else {
         this.transportiesOne_Obj = {} as TransportTypeModel;
        this.titlePage = 'Transport Category - Save';
        this.isDisabled = true;
      }
    }

  ngOnInit(): void {
    this.findTransporties();
    this.findInitialies();
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
    let statusSave = false;

    if ((this.transportiesOne_Obj.name_transport) && (this.transportiesOne_Obj.initials)
     && (this.transportiesOne_Obj.transport_type) && (this.transportiesOne_Obj.transport_type)) {
      statusSave = true;
    } else {
      statusSave = false;
    }

    if (statusSave === true) {
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
