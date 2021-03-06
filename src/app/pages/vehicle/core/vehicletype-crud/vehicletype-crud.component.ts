import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { VehicleTypeModel } from 'app/model/vehicle-type-model';
import { ConfirmationDialogService } from 'app/service/confirmation-dialog.service';
import { VehicleTypeService } from 'app/service/vehicle-type.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-vehicletype-crud',
  templateUrl: './vehicletype-crud.component.html',
  styleUrls: ['./vehicletype-crud.component.css']
})
export class VehicletypeCrudComponent implements OnInit {

  // List Another Requests
  vehicleTypeOne_Obj = {} as VehicleTypeModel;
  isDisabled = true;
  vehiclesTypes: VehicleTypeModel[];

  constructor(
    private vehicleTypeService: VehicleTypeService,
    private router: Router,
    private confirmationDialogService: ConfirmationDialogService,
    private toastr: ToastrService) { }

  ngOnInit(): void {
    this.findVehiclesType();
  }

  // --------- REQUESTs - EXTERNAL ---------------------------------------//

  findVehiclesType() {
    let vehiclesTypesVet: VehicleTypeModel [] = [];
    this.vehicleTypeService.get().subscribe((vehicleCategoryData: Response) => {
      const vehicleTypeDataStr = JSON.stringify(vehicleCategoryData.body);
      JSON.parse(vehicleTypeDataStr, function (key, value) {
        if (key === 'vehiclesType') {
          vehiclesTypesVet = value;
          return value;
        } else {
           return value;
        }
      });
      this.vehiclesTypes = vehiclesTypesVet;
    });
  }


  // --------- OPERATION TRANSACTION - CRUD ---------------------------------------//

  validateSave(event: any) {
    let msg: string;
    if (this.vehicleTypeOne_Obj.type_vehicle) {
      if (this.vehicleTypeOne_Obj.type_vehicle.length < 3) {
        msg = 'Name VehicleType must be 8 min - 30 max characters long';
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
    // Transaction Save
    this.confirmationDialogService.confirm('Save', msg).then((result) => {
      if ( result === true ) {
        if (this.vehicleTypeOne_Obj.id == null) {
          this.vehicleTypeService.post(this.vehicleTypeOne_Obj).subscribe({
            next: data => this.transactionOrchestrator(event, 'Save'),
            error: error => this.showNotification('bottom', 'center', error, 'error')
          });
        } else if (this.vehicleTypeOne_Obj.id != null) {
          this.vehicleTypeService.put(this.vehicleTypeOne_Obj).subscribe({
            next: data => this.transactionOrchestrator(event, 'Update'),
            error: error => this.showNotification('bottom', 'center', error, 'error')
          });
        }
      }
    })
  }

  delete(event: any) {
    let msg: string;
    if ( this.vehicleTypeOne_Obj != null ) {
      msg = 'Confirms the transaction to delete the item from the database?';
      this.confirmationDialogService.confirm('Delete', msg).then((result) => {
        if ( result === true ) {
          // Transaction Delete
          if (this.vehicleTypeOne_Obj.id != null) {
            this.vehicleTypeService.delete(this.vehicleTypeOne_Obj).subscribe({
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
  selectVehicle(event: any, vehicleSelect: VehicleTypeModel) {
    this.isDisabled = false;
    this.vehicleTypeOne_Obj = vehicleSelect;
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

  transactionOrchestrator(event: any, type: String) {
    let msgTransaction = '' as  String;
    console.log('Save Teste', type );
    switch (type) {
      case 'Save': {
        msgTransaction = 'Register Success';
        this.functionRedirectToVehicle();
        break;
      }
      // tslint:disable-next-line:no-switch-case-fall-through
      case 'Update': {
        msgTransaction = 'Update Success';
        this.functionRedirectToVehicle();
        break;
      }
      case 'Delete': {
        msgTransaction = 'Delete Success';
        this.functionRedirectToVehicle();
        break;
      }
    }
    this.findVehiclesType()
    this.showNotification('bottom', 'center', msgTransaction, 'success')
    event.resetForm(event);
    this.vehicleTypeOne_Obj = {} as VehicleTypeModel;
  }


  handleClear(f: NgForm) {
    f.resetForm();
  }

  functionRedirectToVehicle() {
    this.router.navigate(['/vehiclecategory-crud']);
  }



}
