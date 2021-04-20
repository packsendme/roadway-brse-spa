import { LocationService } from './../../../../service/location.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LocationModel } from 'app/model/location-model';
import { ConfirmationDialogService } from 'app/service/confirmation-dialog.service';
import { CurrencyService } from 'app/service/currency.service';
import { ToastrService } from 'ngx-toastr';
import { CurrencyModel } from 'app/model/currency-model';

@Component({
  selector: 'app-currency-crud',
  templateUrl: './currency-crud.component.html',
  styleUrls: ['./currency-crud.component.css']
})
export class CurrencyCrudComponent implements OnInit {

// List Another Requests
currencies: CurrencyModel[];
locations: LocationModel[];

// Variable - Field
nameCurrency: string;
symbolCurrency: string;
countryCurrency: string[] = [];
countryNew_Obj: LocationModel;


// Screen Option
currencyOne_Obj = {} as CurrencyModel;
isDisabled = true;

constructor(
  private currencyService: CurrencyService,
  private locationService: LocationService,
  private router: Router,
  private confirmationDialogService: ConfirmationDialogService,
  private toastr: ToastrService) { }

ngOnInit(): void {
  this.findCurreny();
  this.findCountry();
}

// --------- REQUESTs - EXTERNAL ---------------------------------------//

findCurreny() {
  let currenyVet: CurrencyModel[] = [];
  this.currencyService.get().subscribe((currencyData: Response) => {
  const currencyStr = JSON.stringify(currencyData.body);
  JSON.parse(currencyStr, function (key, value) {
    if (key === 'currencies') {
      currenyVet = value;
      return value;
    } else {
        return value;
      }
    });
    this.currencies = currenyVet;
  });
}

findCountry() {
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

// --------- OPERATION TRANSACTION - CRUD ---------------------------------------//
validateSave(event: any) {
  let msg: string;
  let checkValidate = false;

  if ( (this.nameCurrency) && (this.symbolCurrency) && (this.countryCurrency)) {
    if (this.nameCurrency.length < 2) {
      msg = 'Currency Name must be 5 min - 30 max characters long';
      this.showNotification('bottom', 'center', msg, 'error');
      checkValidate = true;
    }
    if (this.symbolCurrency.length < 1) {
      msg = 'Symbol Currency  must be 2 min - 5 max characters long';
      this.showNotification('bottom', 'center', msg, 'error');
      checkValidate = true;
    }
    if (checkValidate === false) {
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
      this.currencyOne_Obj.name = this.nameCurrency;
      this.currencyOne_Obj.symbol = this.symbolCurrency;
      this.currencyOne_Obj.country = this.countryCurrency;

      // Transaction Save
      if (this.currencyOne_Obj.id == null) {
        this.currencyService.post(this.currencyOne_Obj).subscribe({
          next: data => this.transactionOrchestrator(null, 'Save', 'Register Success'),
          error: error => this.showNotification('bottom', 'center', error, 'error')
        });
      } else if (this.currencyOne_Obj.id != null) {
        this.currencyService.put(this.currencyOne_Obj).subscribe({
          next: data => this.transactionOrchestrator(null, 'Save', 'Update Success'),
          error: error => this.showNotification('bottom', 'center', error, 'error')
        });
      }
    }
  })
  .catch(() => console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'));
}

delete(event: any) {
  const msg = 'Confirms the transaction to delete the item from the database?';
  if ( this.currencyOne_Obj != null ) {
    this.confirmationDialogService.confirm('Delete', msg).then((result) => {
      if ( result === true ) {
        // Transaction Delete
        if (this.currencyOne_Obj.id != null) {
          this.currencyService.delete(this.currencyOne_Obj).subscribe({
            next: data => this.transactionOrchestrator(event, 'Delete', 'Delete Success'),
            error: error => this.showNotification('bottom', 'center', error, 'error')
          });
        }
      }
    })
    .catch(() => console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'));
  }
}

// --------------------------------------------------------------------------------//

select(event: any, currencySelect: CurrencyModel) {
  this.isDisabled = false;
  this.currencyOne_Obj = currencySelect;
  this.nameCurrency = currencySelect.name;
  this.symbolCurrency = currencySelect.symbol;
  this.countryCurrency = currencySelect.country;
}

// ------------------------------------------------------------------------//
// OPERATION NOTIFICATION ::
// ------------------------------------------------------------------------//

transactionOrchestrator(event: any, type: String, msgTransaction: String ) {
  switch (type) {
    case 'Save': {
      type = 'success';
      this.functionRedirectToView();
      break;
    }
    case 'Delete': {
      type = 'success';
      this.functionRedirectToView();
      break;
    }
    case 'Validation': {
      type = 'error';
      break;
    }
    case 'Info': {
      type = 'info';
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
        '<span data-notify="icon" class="nc-icon nc-bell-55"></span><span data-notify="message">'+ msg +'</span>','', {
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
        '<span data-notify="icon" class="nc-icon nc-bell-55"></span><span data-notify="message">'+ msg +'</span>','', {
          timeOut: 4000,
          enableHtml: true,
          closeButton: true,
          toastClass: 'alert alert-danger alert-with-icon',
          positionClass: 'toast-' + from + '-' + align
        }
      );
    break;
    case 'info':
      this.toastr.info(
        '<span data-notify="icon" class="nc-icon nc-bell-55"></span><span data-notify="message">'+ msg +'</span>','', {
          timeOut: 4000,
          enableHtml: true,
          closeButton: true,
          toastClass: 'alert alert-warning alert-with-icon',
          positionClass: 'toast-' + from + '-' + align
        }
      );
    // tslint:disable-next-line:no-switch-case-fall-through
    default:
    break;
  }
}


// ------------------------------------------------------------------------//
// OPERATION FIELD COUNRTY
// ------------------------------------------------------------------------//

  addCountry() {
    let statusCountry = false;
    if (this.countryCurrency.length) {
      this.countryCurrency.forEach( (countryObj) => {
        if (countryObj === this.countryNew_Obj.countryName) {
          statusCountry = true;
        }
      })
    }

    if ( statusCountry === false ) {
      this.countryCurrency.push(this.countryNew_Obj.countryName);
    } else {
      this.transactionOrchestrator(null, 'Validation', 'The selected field is already added');
    }
  }

  removeCountry(countryEditSelect: String) {
      const countryObj = this.countryCurrency.findIndex(country => country === countryEditSelect);
      this.countryCurrency.splice(countryObj, 1);
  }

// ------------------------------------------------------------------------//
// OPERATION REDIRECT
// ------------------------------------------------------------------------//

  functionRedirectToView() {
    this.router.navigate(['/roadway-view']);
  }
  functionRedirectToLocation() {
    this.router.navigate(['/location-view']);
  }
}
