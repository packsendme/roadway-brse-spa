import { CurrencyService } from './../../../service/currency.service';
import { CurrencyModel } from './../../../model/currency-model';
import { TollsFuelModel } from './../../../model/tolls-fuel-model';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataTO } from 'app/model/dataTO';
import { LocationModel } from 'app/model/location-model';
import { ConfirmationDialogService } from 'app/service/confirmation-dialog.service';
import { LocationService } from 'app/service/location.service';
import { ToastrService } from 'ngx-toastr';
import { TollsfuelService } from 'app/service/tollsfuel.service';

@Component({
  selector: 'app-fueltolls-crud',
  templateUrl: './fueltolls-crud.component.html',
  styleUrls: ['./fueltolls-crud.component.css']
})
export class FueltollsCrudComponent implements OnInit {

  locatioOne_Obj = {} as LocationModel;
  locations: LocationModel[];
  currencies: CurrencyModel[];
  fueltollsOne_Obj = {} as TollsFuelModel;

  titlePage: string;
  isShow = false;
  isEdit = true;
  isDisabled = false;
  dt_incS = null;
  dt_updateS = null;

  constructor(
    private locationService: LocationService,
    private tollsfuelService: TollsfuelService,
    private currencyService: CurrencyService,
    private toastr: ToastrService,
    private fueltollsTO: DataTO,
    private confirmationDialogService: ConfirmationDialogService,
    private router: Router) {
      if ( this.fueltollsTO.tollsfuelData != null ) {
        this.fueltollsOne_Obj = fueltollsTO.tollsfuelData;
        this.titlePage = 'Fuel&Tolls - Update';
        console.log('Fuel&Tolls', this.fueltollsOne_Obj.country);
        this.isDisabled = false;
        this.dt_incS = this.fueltollsOne_Obj.dt_inc.toLocaleString();
        if (this.fueltollsOne_Obj.dt_update) {
          this.dt_updateS = this.fueltollsOne_Obj.dt_update.toLocaleString();
        }
      } else {
        this.fueltollsOne_Obj = {} as TollsFuelModel;
        this.isEdit = false;
        this.titlePage = 'Fuel&Tolls - Save New';
        this.isDisabled = true;
      }
    }

  ngOnInit(): void {
    this.findLocations();
    this.findCurrency();
  }

  //--------- REQUESTs - EXTERNAL ---------------------------------------//

  findLocations() {
    let locationsVet: LocationModel[] = [];
    this.locationService.getLocation().subscribe((locationsData: Response) =>{
      const locationsStr = JSON.stringify(locationsData.body);
      JSON.parse(locationsStr, function (key, value) {
        if (key === 'locations') {
          locationsVet = value;
          return value;
        } else {
          return value;
        }
      });
      this.locations = locationsVet;
    });
  }

  findCurrency() {
    let currencyVet: CurrencyModel[] = [];
    this.currencyService.get().subscribe((currencyData: Response) =>{
      const currencyStr = JSON.stringify(currencyData.body);
      JSON.parse(currencyStr, function (key, value) {
        if (key === 'currencies') {
          currencyVet = value;
          return value;
        } else {
          return value;
        }
      });
      this.currencies = currencyVet;
    });
  }

// --------- OPERATION TRANSACTION - CRUD ---------------------------------------//
  validateSave(event: any) {
    let msg: string;
    let statusSave = false;
    if (this.fueltollsOne_Obj.country){
      // tslint:disable-next-line:no-unused-expression
      if ((this.fueltollsOne_Obj.tolls_price === 0.00) || (this.fueltollsOne_Obj.fuelGasoline_price === 0.00)
      || (this.fueltollsOne_Obj.fuelDiesel_price === 0.00)){
        statusSave = false;
      } else {
        statusSave = true;
      }
    } else {
      statusSave = false;
    }

    if (statusSave === true) {
      msg = 'Confirm the transaction in the database?';
      this.save(event, msg);
    } else {
      msg = 'Check the required fields, numeric fields are not allowed values 0.00';
      this.showNotification('bottom', 'center', msg, 'error');
    }
  }

  save(event: any, msg: any) {
    // Transaction Save
    console.log('SAVE ', this.locatioOne_Obj.cities);

    this.confirmationDialogService.confirm('Save', msg).then((result) => {
      if ( result === true ) {
        if (this.isEdit === false) {
          this.tollsfuelService.post(this.fueltollsOne_Obj).subscribe({
            next: data => this.transactionOrchestrator(event, 'Save'),
            error: error => this.showNotification('bottom','center', error, 'error')
          });
        } else if (this.isEdit === true) {
          this.locationService.putLocation(this.locatioOne_Obj).subscribe({
            next: data => this.transactionOrchestrator(event, 'Update'),
            error: error => this.showNotification('bottom', 'center', error, 'error')
          });
        }
      }
    });
  }

  delete(event: any) {
    console.log(' deleteLocation ');
    const msg = 'Confirms the transaction to delete the item from the database?';
    // Transaction Delete
    this.confirmationDialogService.confirm('Delete', msg).then((result) => {
      if (this.locatioOne_Obj.id != null) {
        this.locationService.deleteLocation(this.locatioOne_Obj).subscribe({
          next: data => this.transactionOrchestrator(event, 'Delete'),
          error: error => this.showNotification('bottom', 'center', error, 'error')
        });
      }
    });
  }

// ---------  NOTIFICATION MESSAGE -------------------------------------------------------------//

  transactionOrchestrator(event: any, type: String) {
    let msgTransaction = '' as  String;
    switch (type) {
      case 'Update': {
        msgTransaction = 'Update Success';
        type = 'success';
        console.log('Update Success');
        this.functionRedirectToView();
        break;
      }
      case 'Save': {
        msgTransaction = 'Register Success';
        type = 'success';
        this.functionRedirectToView();
        break;
      }
      case 'Delete': {
        msgTransaction = 'Delete Success';
        type = 'success';
        this.functionRedirectToView();
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

// OPERATION REDIRECT  ---------------------//

  functionRedirectToView() {
    this.router.navigate(['/fueltolls-view']);
  }

}
