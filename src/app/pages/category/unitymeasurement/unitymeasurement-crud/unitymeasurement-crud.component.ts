import { UnityMeasurementService } from 'app/service/unity-measurement.service';
import { Component, OnInit } from '@angular/core';
import { UnityMeasurementModel } from 'app/model/unity-measurement-model';
import { Router } from '@angular/router';
import { ConfirmationDialogService } from 'app/service/confirmation-dialog.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-unitymeasurement-crud',
  templateUrl: './unitymeasurement-crud.component.html',
  styleUrls: ['./unitymeasurement-crud.component.css']
})
export class UnitymeasurementCrudComponent implements OnInit {


  // List Another Requests
  unityMeasurementOne_Obj: UnityMeasurementModel[];
  unityMeasurements: UnityMeasurementModel[];

  // Screen Option
  //unityMeasurOne_Obj = {} as UnityMeasurementModel;
  isDisabled = true;

  // Field to Change in update mode
  id: String;
  unityType: String;
  unityArea: String = '';
  unityArea_L: String[] = [];
  unityVolume: String = '';
  unityVolume_L: String[] = [];
  unityWeight = '';
  unityWeightLevel = '';
  unityWeight_M = new Map<string, string>();
  unityWeightLevel_L: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  unityTemperature: String = '';
  unityTemperature_L: String[] = [];
  unityCurrency: String = '';
  unitCurrency_L: String[] = [];

  constructor(
    private unityMeasurService: UnityMeasurementService,
    private router: Router,
    private confirmationDialogService: ConfirmationDialogService,
    private toastr: ToastrService) { }

  ngOnInit(): void {
    this.findUnityMeasurement();
  }

// ------------------------------------------------//
// HTTPS - REQUEST EXTERNAL
// ------------------------------------------------//

findUnityMeasurement() {
  let unityMeasurementVet: UnityMeasurementModel[] = [];
  this.unityMeasurService.get().subscribe((unityMeasurementData: Response) => {
    const unityMeasurementDataStr = JSON.stringify(unityMeasurementData.body);
    JSON.parse(unityMeasurementDataStr, function (key, value) {
      if (key === 'unityMeasurements') {
        unityMeasurementVet = value;
        return value;
      } else {
        return value;
      }
    });
  this.unityMeasurements = unityMeasurementVet;
  });
}

// ------------------------------------------------//
// DDBB TRANSACTION
// ------------------------------------------------//

  validateSave(event: any) {
    let msg: string;

    if ((this.unityType) && (this.unityArea_L.length !== 0) && (this.unityVolume_L.length !== 0)
    && (this.unityWeight_M.size !== 0)) {

      const unityMeasurOne: UnityMeasurementModel = {
        id: null,
        unityType: this.unityType,
        unityArea: this.unityArea_L,
        unityVolume: this.unityVolume_L,
        unityWeight: this.unityWeight_M,
        unityTemperature: null,
        unityCurrency: null
      };
      console.log('JSON ', unityMeasurOne);
      msg = 'Confirm the transaction in the database?';
      this.save(unityMeasurOne, msg);
    } else {
      msg = 'Check the required fields';
      this.showNotification('bottom', 'center', msg, 'error');
    }
  }

  save(unityMeasurOne: UnityMeasurementModel, msg: any) {
    this.confirmationDialogService.confirm('Save', msg).then((result) => {
      if ( result === true ) {
        // Transaction Save
        if (unityMeasurOne.id == null) {
          console.log('SAVE ', unityMeasurOne);
          this.unityMeasurService.post(unityMeasurOne).subscribe({
            next: data => this.transactionOrchestrator(event, 'Save'),
            error: error => this.showNotification('bottom', 'center', error, 'error')
          });
        } else if (unityMeasurOne.id != null) {
          this.unityMeasurService.put(unityMeasurOne).subscribe({
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
    if ( this.id != null ) {
      this.confirmationDialogService.confirm('Delete', msg).then((result) => {
        if ( result === true ) {
          // Transaction Delete
          if (this.id  != null) {
            this.unityMeasurService.delete(this.id).subscribe({
              next: data => this.transactionOrchestrator(event, 'Delete'),
              error: error => this.showNotification('bottom', 'center', error, 'error')
            });
          }
        }
      })
      .catch(() => console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'));
    }
  }

// ------------------------------------------------//
// TRANSACTION - TABLE ADD/DELETE
// ------------------------------------------------//

  select(event: any, unityMeasurementSelect: UnityMeasurementModel) {
    this.isDisabled = false;
    this.id = unityMeasurementSelect.id;
    this.unityType = unityMeasurementSelect.unityType;
    this.unityArea_L = unityMeasurementSelect.unityArea;
    this.unityVolume_L = unityMeasurementSelect.unityVolume;
    this.unityWeight_M = unityMeasurementSelect.unityWeight;
    this.unityTemperature_L = unityMeasurementSelect.unityTemperature;
    this.unitCurrency_L = unityMeasurementSelect.unityCurrency;
  }

  // UNITY-AREA
  addArea() {
    let statusAdd = false;
    if (this.unityArea.length > 0) {
      if ( this.unityArea_L.length >= 1) {
        this.unityArea_L.forEach( (areaObj) => {
          if (areaObj === this.unityArea) {
            statusAdd = true;
          }
        })
      }
    } else {
      statusAdd = true;
    }

    if ( statusAdd === false ) {
      this.unityArea_L.push(this.unityArea);
    } else {
      this.transactionOrchestrator(null, 'ValidationII');
    }
  }

  removeArea(areaEditSelect: string) {
    const error = 'It is not possible delete';
    if ( this.unityArea_L.length >= 1) {
      const areaObj = this.unityArea_L.findIndex(area => area === areaEditSelect);
      this.unityArea_L.splice(areaObj, 1);
    }
  }

  // UNITY-VOLUME
  addVolume() {
    let statusAdd = false;

    if (this.unityVolume.length > 0) {
      if ( this.unityVolume_L.length >= 1) {
        this.unityVolume_L.forEach( (volumeObj) => {
          if (volumeObj === this.unityVolume) {
            statusAdd = true;
          }
        })
      }
    } else {
      statusAdd = true;
    }

    if ( statusAdd === false ) {
      this.unityVolume_L.push(this.unityVolume);
    } else {
      this.transactionOrchestrator(null, 'ValidationII');
    }
  }

  removeVolume(volumeEditSelect: string) {
    const error = 'It is not possible delete';
    if ( this.unityVolume_L.length >= 1) {
      const volumeObj = this.unityVolume_L.findIndex(volume => volume === volumeEditSelect);
      this.unityVolume_L.splice(volumeObj, 1);
    }
  }

  // UNITY-WEIGHT
  addWeight() {
    let statusAdd = false;

    if ((this.unityWeight.length > 0) && (this.unityWeightLevel !== '0')) {
      if ( this.unityWeight_M.size >= 1) {
        if ( (this.unityWeight_M.get(this.unityWeight)) || (this.unityWeight_M.get(this.unityWeightLevel))) {
            statusAdd = true;
          }
      }
    } else {
      statusAdd = true;
    }

    if ( statusAdd === false ) {
      this.unityWeight_M.set(this.unityWeightLevel, this.unityWeight);
      console.log('MAP', this.unityWeight_M);
    } else {
      this.transactionOrchestrator(null, 'ValidationII');
    }
  }

  removeWeight(weightEditSelect: string) {
    const error = 'It is not possible delete';
    if ( this.unityWeight_M.size >= 1) {
      this.unityWeight_M.delete(weightEditSelect);
    }
  }

// UNITY-TEMPERATURE
addTemperature() {
  let statusAdd = false;

  if (this.unityTemperature.length > 0) {
    if ( this.unityTemperature_L.length >= 1) {
      this.unityTemperature_L.forEach( (temperatureObj) => {
        if (temperatureObj === this.unityTemperature) {
          statusAdd = true;
        }
      })
    }
  } else {
    statusAdd = true;
  }

  if ( statusAdd === false ) {
    this.unityTemperature_L.push(this.unityTemperature);
  } else {
    this.transactionOrchestrator(null, 'ValidationII');
  }
}

removeTemperature(temperatureEditSelect: string) {
  const error = 'It is not possible delete';
  if ( this.unityTemperature_L.length >= 1) {
    const temperatureObj = this.unityTemperature_L.findIndex(temperature => temperature === temperatureEditSelect);
    this.unityTemperature_L.splice(temperatureObj, 1);
  }
}

// UNITY-CURRENCY
addCurrency() {
  let statusAdd = false;

  if (this.unityCurrency.length > 0) {
    if ( this.unitCurrency_L.length >= 1) {
      this.unitCurrency_L.forEach( (currencyObj) => {
        if (currencyObj === this.unityCurrency) {
          statusAdd = true;
        }
      })
    }
  } else {
    statusAdd = true;
  }

  if ( statusAdd === false ) {
    this.unitCurrency_L.push(this.unityCurrency);
  } else {
    this.transactionOrchestrator(null, 'ValidationII');
  }
}

removeCurrency(currencyEditSelect: string) {
  const error = 'It is not possible delete';
  if ( this.unitCurrency_L.length >= 1) {
    const currencyObj = this.unitCurrency_L.findIndex(currency => currency === currencyEditSelect);
    this.unitCurrency_L.splice(currencyObj, 1);
  }
}

// ------------------------------------------------//
// NOTIFICATION
// ------------------------------------------------//

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


// ------------------------------------------------------------------------//
//  REDIRECT
// ------------------------------------------------------------------------//

  functionRedirectToView() {
    this.router.navigate(['/category-new']);
  }
}


