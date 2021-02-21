import { VehicleClassificationService } from './../../../../service/vehicle-classification.service';
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfirmationDialogService } from 'app/service/confirmation-dialog.service';
import { VehicleTypeService } from 'app/service/vehicle-type.service';
import { VehicleTypeModel } from 'app/model/vehicle-type-model';
import { VehicleClassificationModel } from 'app/model/vehicle-classification-model';

@Component({
  selector: 'app-vehicleclassification',
  templateUrl: './vehicleclassification-crud.component.html',
  styleUrls: ['./vehicleclassification-crud.component.css']
})
export class VehicleclassificationCrudComponent implements OnInit {

   // List Another Requests
   vehiclesTypes_L: VehicleTypeModel[];
   vehiclesClassification_L: VehicleClassificationModel[];
   vehicleType: String = '';

  // Screen Option
  vehicleClassificationOne_Obj = {} as VehicleClassificationModel;
  isDisabled = true;

  vehicleClassification: String = '';
  vehicleClassification_L = [];

  vehicleSubclassification: String = '';
  vehicleSubclassification_L = [];

  constructor(
    private vehicleClassificationService: VehicleClassificationService,
    private vehicleTypeService: VehicleTypeService,
    private router: Router,
    private confirmationDialogService: ConfirmationDialogService,
    private toastr: ToastrService) { }

  ngOnInit(): void {
    this.findVehiclesType();
    this.findVehiclesClassification();
  }

  // --------- REQUESTs - EXTERNAL ---------------------------------------//

  findVehiclesType() {
    let vehiclesTypesVet: VehicleClassificationModel [] = [];
    this.vehicleTypeService.get().subscribe((vehicleTypeData: Response) => {
      const vehicleTypeDataStr = JSON.stringify(vehicleTypeData.body);
      JSON.parse(vehicleTypeDataStr, function (key, value) {
        if (key === 'vehiclesType') {
          vehiclesTypesVet = value;
          return value;
        } else {
           return value;
        }
      });
      this.vehiclesTypes_L = vehiclesTypesVet;
    });
  }

  findVehiclesClassification() {
    let vehiclesClassificationVet: VehicleClassificationModel [] = [];
    this.vehicleClassificationService.get().subscribe((vehicleCategoryData: Response) => {
      const vehicleCategoryDataStr = JSON.stringify(vehicleCategoryData.body);
      JSON.parse(vehicleCategoryDataStr, function (key, value) {
        if (key === 'vehiclesClassification') {
          vehiclesClassificationVet = value;
          return value;
        } else {
           return value;
        }
      });
      this.vehiclesClassification_L = vehiclesClassificationVet;
    });
  }

  // --------- OPERATION TRANSACTION - CRUD ---------------------------------------//

  validateSave(event: any) {
    let msg: string;
    if ((this.vehicleClassification_L.length === 0) && (this.vehiclesTypes_L.length === 0)) {
        msg = 'Check the required fields';
        this.showNotification('bottom', 'center', msg, 'error');
    } else {
        msg = 'Confirms the transaction to save the item in the database?';
        this.save(event, msg);
     }
  }

  save(event: any, msg: any) {
    // Transaction Save
    this.confirmationDialogService.confirm('Save', msg).then((result) => {
      if ( result === true ) {
        this.vehicleClassificationOne_Obj.type_vehicle = this.vehicleType;
        this.vehicleClassificationOne_Obj.classification_vehicle = this.vehicleClassification_L;
        this.vehicleClassificationOne_Obj.subclassification_vehicle = this.vehicleSubclassification_L;
        if (this.vehicleClassificationOne_Obj.id == null) {
          this.vehicleClassificationService.post(this.vehicleClassificationOne_Obj).subscribe({
            next: data => this.transactionOrchestrator(event, 'Save'),
            error: error => this.showNotification('bottom', 'center', error, 'error')
          });
        } else if (this.vehicleClassificationOne_Obj.id != null) {
          this.vehicleClassificationService.put(this.vehicleClassificationOne_Obj).subscribe({
            next: data => this.transactionOrchestrator(event, 'Update'),
            error: error => this.showNotification('bottom', 'center', error, 'error')
          });
        }
      }
    })
  }

  delete(event: any) {
    let msg: string;
    if ( this.vehicleClassificationOne_Obj != null ) {
      msg = 'Confirms the transaction to delete the item from the database?';
      this.confirmationDialogService.confirm('Delete', msg).then((result) => {
        if ( result === true ) {
          // Transaction Delete
          if (this.vehicleClassificationOne_Obj.id != null) {
            this.vehicleClassificationService.delete(this.vehicleClassificationOne_Obj).subscribe({
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

selectVehicle(event: any, vehicleSelect: VehicleClassificationModel) {
  this.isDisabled = false;
  this.vehicleClassificationOne_Obj = vehicleSelect;
  this.vehicleType = vehicleSelect.type_vehicle;
  this.vehicleClassification_L = vehicleSelect.classification_vehicle;
  this.vehicleSubclassification_L = vehicleSelect.subclassification_vehicle;
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
    this.vehicleClassificationOne_Obj = {} as VehicleClassificationModel;
  }

  handleClear(f: NgForm) {
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

  functionRedirectToVehicle() {
    this.router.navigate(['/vehicle-crud']);
  }

  functionRedirectToVehicleType() {
    this.router.navigate(['/vehicletype-crud']);
  }

  // FIELD CATEGORY VEHICLE ---------------------//
  removeClassification(vehicleEditSelect: String) {
    const error = 'It is not possible to delete a single vehicle that is registered';

    if ( this.vehicleClassification_L.length > 1) {
      const vehicleObj = this.vehicleClassification_L.findIndex(vehicle => vehicle === vehicleEditSelect);
      this.vehicleClassification_L.splice(vehicleObj, 1);
    } else if ( this.vehicleClassification_L.length === 1) {
      this.showNotification('bottom', 'center', error, 'error');
    }
  }

  addClassification() {
    let statusVehicle = false;
    if ( this.vehicleClassification_L.length >= 1) {
      this.vehicleClassification_L.forEach( (vehicleObj) => {
        if (vehicleObj === this.vehicleClassification) {
          statusVehicle = true;
        }
      });
    }
    if ( statusVehicle === false ) {
      this.vehicleClassification_L.push(this.vehicleClassification);
    }
  }

    // FIELD SUBCATEGORY VEHICLE ---------------------//
    removeSubclassification(vehicleEditSelect: String) {
      const error = 'It is not possible to delete a single vehicle that is registered';

      if ( this.vehicleSubclassification_L.length > 1) {
        const vehicleObj = this.vehicleSubclassification_L.findIndex(vehicle => vehicle === vehicleEditSelect);
        this.vehicleSubclassification_L.splice(vehicleObj, 1);
      } else if ( this.vehicleSubclassification_L.length === 1) {
        this.showNotification('bottom', 'center', error, 'error');
      }
    }

    addSubclassification() {
      let statusVehicle = false;
      if ( this.vehicleSubclassification_L.length >= 1) {
        this.vehicleSubclassification_L.forEach( (vehicleObj) => {
          if (vehicleObj === this.vehicleSubclassification) {
            statusVehicle = true;
          }
        });
      }
      if ( statusVehicle === false ) {
        this.vehicleSubclassification_L.push(this.vehicleSubclassification);
      }
    }


}


