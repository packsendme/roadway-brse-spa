import { CountryService } from './../../../service/country.service';
import { Router } from '@angular/router';
import { Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { LocationModel } from 'app/model/location-model';
import { LocationService } from 'app/service/location.service';
import { DataTO } from 'app/model/dataTO';
import { ConfirmationDialogService } from 'app/service/confirmation-dialog.service';
import { CountryModel } from 'app/model/country-model';

@Component({
  selector: 'app-location',
  templateUrl: './location-crud.component.html',
  styleUrls: ['./location-crud.component.css']
})
export class LocationCrudComponent implements OnInit {
  locations: LocationModel[];
  countries: CountryModel[];

  locatioOne_Obj = {} as LocationModel;
  countryOne_Obj = {} as CountryModel;

  titlePage: string;
  isShow = false;
  isEdit = false;
  isDisabled = false;
  cityName: String = '';
  cities: String[];

  constructor(
    private locationService: LocationService,
    private countryService: CountryService,
    private toastr: ToastrService,
    private locationTO: DataTO,
    private confirmationDialogService: ConfirmationDialogService,
    private router: Router) {
      if ( this.locationTO.locationData != null ) {
        this.locatioOne_Obj = locationTO.locationData;
        this.titlePage = 'Location - Update';
        this.isDisabled = false;
        if (this.locatioOne_Obj.citySpecify === true) {
          this.isShow = true;
        }
      } else {
        this.locatioOne_Obj = {} as LocationModel;
        this.locatioOne_Obj.cities = [];
        this.isEdit = false;
        this.titlePage = 'Location - Save';
        this.isDisabled = true;
      }
    }

  ngOnInit(): void {
    this.findCountries();
  }

//--------- REQUESTs - EXTERNAL ---------------------------------------//

findCountries() {
  let countriesVet: CountryModel [] = [];
  this.countryService.get().subscribe((countryData: Response) => {
    const transportTypeDataStr = JSON.stringify(countryData.body);
    JSON.parse(transportTypeDataStr, function (key, value) {
      if (key === 'countries') {
        countriesVet = value;
        return value;
      } else {
        return value;
      }
    });
    this.countries = countriesVet;
  });
}

// --------- OPERATION TRANSACTION - CRUD ---------------------------------------//
  validateSave(event: any) {
    let msg: string;
    let statusSave = false;
    if ((this.locatioOne_Obj.codCountry) && (this.locatioOne_Obj.countryName)) {
      if ((this.locatioOne_Obj.citySpecify === true) && (this.locatioOne_Obj.cities.length === 0)) {
        statusSave = false;
      } else {
        statusSave = true;
        const countryShortName = this.locatioOne_Obj.countryName.split(' ', 1);
        this.locatioOne_Obj.countryShortName = countryShortName[0];
      }
    } else {
        statusSave = false;
    }

    if (statusSave === true) {
      msg = 'Confirm the transaction in the database?';
      this.save(event, msg);
    } else {
      msg = 'Check the required fields';
      this.showNotification('bottom', 'center', msg, 'error');
    }
  }

  save(event: any, msg: any) {
    // Transaction Save
    console.log('SAVE ', this.locatioOne_Obj.cities);

    this.confirmationDialogService.confirm('Save', msg).then((result) => {
      if ( result === true ) {
        if (this.locatioOne_Obj.id == null) {
          this.locationService.postLocation(this.locatioOne_Obj).subscribe({
            next: data => this.transactionOrchestrator(event, 'Save'),
            error: error => this.showNotification('bottom','center', error, 'error')
          });
        } else if (this.locatioOne_Obj.id != null) {
          this.locationService.putLocation(this.locatioOne_Obj).subscribe({
            next: data => this.transactionOrchestrator(event, 'Update'),
            error: error => this.showNotification('bottom','center', error, 'error')
          });
        }
      }
    });
  }

  delete(event: any){
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
        this.functionRedirectToLocation();
        break;
      }
      case 'Save': {
        msgTransaction = 'Register Success';
        type = 'success';
        this.functionRedirectToLocation();
        break;
      }
      case 'Delete': {
        msgTransaction = 'Delete Success';
        type = 'success';
        this.functionRedirectToLocation();
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

// TRANSACTION LOCATION  ---------------------//

addCity() {
  let statusAdd = false;
  console.log('addCity', this.cityName);
  if (this.locatioOne_Obj.cities) {
    if ( this.locatioOne_Obj.cities.length >= 1) {
      this.locatioOne_Obj.cities.forEach( (cityV) => {
        if (cityV === this.cityName) {
          statusAdd = true;
        }
      })
    }
  }
  if ( statusAdd === false ) {
    this.locatioOne_Obj.cities.push(this.cityName);
  } else {
    this.transactionOrchestrator(null, 'ValidationII');
  }
}

removeCity(cityEditSelect: string) {
  const cityFindDelete = this.locatioOne_Obj.cities.indexOf(cityEditSelect);
  this.locatioOne_Obj.cities.splice(cityFindDelete, 1);
  console.log('ValidationII', this.locatioOne_Obj.cities);
  if (this.locatioOne_Obj.cities.length === 0) {
    this.locatioOne_Obj.citySpecify = false;
    this.isShow = false;
  }

}

onChange(object: any) {
  const countryCodObj = this.countries.find(countrydb => countrydb.namecountry === this.locatioOne_Obj.countryName);
  this.locatioOne_Obj.codCountry = countryCodObj.codcountry;
  this.locatioOne_Obj.citySpecify = false;
  this.locatioOne_Obj.identifier = countryCodObj.identifier;
  this.resetCitiesToNull();
  this.isShow = false;
}

resetCitiesToNull() {
  this.locatioOne_Obj.cities = [];
}

// OPERATION REDIRECT  ---------------------//

  functionRedirectToLocation() {
    this.router.navigate(['/location-view']);
  }

  toggleDisplay(value: boolean) {
    this.isShow = value;
    if (value === false){
      this.resetCitiesToNull();
    }
  }

}
