import { LifecycleService } from './../../../../service/lifecycle.service';
import { CurrencyService } from 'app/service/currency.service';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { LocationService } from 'app/service/location.service';
import { ToastrService } from 'ngx-toastr';
import { CategoryModel } from 'app/model/category-model';
import { CategoryService } from 'app/service/category.service';
import { LocationModel } from 'app/model/location-model';
import { CostsModel } from 'app/model/costs-model';
import { ConfirmationDialogService } from 'app/service/confirmation-dialog.service';
import { TransportTypeModel } from 'app/model/transport-type-model';
import { RoadwaybreService } from 'app/service/roadwaybre.service';
import { TransportTypeService } from 'app/service/transport-type.service';
import { RoadwaybreModel } from 'app/model/roadwaybre-model';
import { DataTO } from 'app/model/dataTO';
import { CurrencyModel } from 'app/model/currency-model';
import { StatusModel } from 'app/model/status-model.enum';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'roadway-update',
  templateUrl: './roadway-update.component.html',
  styleUrls: ['./roadway-update.component.css']
})
export class RoadwayUpdateComponent implements OnInit {

  // List Another Requests
  categories: CategoryModel[];
  locations: LocationModel[];
  transporties: TransportTypeModel[];
  currencies: CurrencyModel[];

  // Screen Option
  countrySelCosts = {} as string;

  // Status
  isRegistered = false;
  isPublished = false;
  isBlocked = false;
  isUnlocked = false;
  isCanceled = false;


  statusEditNew_btn = true;
  isShow = false;
  isEdit = false;
  isDelete = false;
  isBlockedField = false;
  editdisabled = true;
  viewButton = false;
  dateChangeNew_Obj: String;
  nameBREEdit_Obj: String;

  // Category Table View By transport Type
  isCargoMix = false;
  isPeople = false;
  isMixed = false;

  // Model Costs to HTML
  costsBRE_DS: CostsModel[] = [];
  costsBREII_DS: CostsModel[] = [];
  clonedCosts: { [s: string]: CostsModel; } = {};

  // Edit Object - Entity
  roadwaybreEdit_Obj = {} as RoadwaybreModel;
  transportEdit_Obj: TransportTypeModel;
  countryEdit_Obj = {} as LocationModel;
  categoryEdit_Obj = {} as CategoryModel;
  locationCosts: String[] = [];
  currency_Obj: CurrencyModel;

  constructor(
    private roadwayData: DataTO,
    private roadwayBREService: RoadwaybreService,
    private categoryService: CategoryService,
    private locationService: LocationService,
    private currencyService: CurrencyService,
    private toastr: ToastrService,
    private lifeCycleService: LifecycleService,
    private router: Router,
    private transportService: TransportTypeService,
    private confirmationDialogService: ConfirmationDialogService) {
      console.log(' BusinessruleUpdateComponent - Constructor ');
      if ( this.roadwayData.roadwayBREData != null ) {
        this.roadwaybreEdit_Obj = this.roadwayData.roadwayBREData;
        this.isEdit = true;

        if (this.roadwaybreEdit_Obj.status === StatusModel.Registered) {
            this.isRegistered = true;
            this.isBlockedField = true;
            this.isDelete = true;
            this.isPublished = false;
            this.isBlocked = false;
            this.isUnlocked = false;
            this.isCanceled = false;
        } else if (this.roadwaybreEdit_Obj.status === StatusModel.Published) {
            this.isPublished = true;
            this.isBlockedField = false;
            this.isRegistered = false;
            this.isBlocked = false;
            this.isUnlocked = false;
            this.isCanceled = false;
        } else if (this.roadwaybreEdit_Obj.status === StatusModel.Blocked) {
            this.isBlocked = true;
            this.isBlockedField = false;
            this.isRegistered = false;
            this.isPublished = false;
            this.isUnlocked = false;
            this.isCanceled = false;
        } else if (this.roadwaybreEdit_Obj.status === StatusModel.Unlocked) {
            this.isUnlocked = true;
            this.isDelete = false;
            this.isBlockedField = true;
            this.isRegistered = false;
            this.isPublished = false;
            this.isBlocked = false;
            this.isCanceled = false;
        } else if (this.roadwaybreEdit_Obj.status === StatusModel.Canceled) {
            this.isCanceled = true;
            this.isDelete = true;
            this.isBlockedField = false;
            this.isRegistered = false;
            this.isPublished = false;
            this.isBlocked = false;
            this.isUnlocked = false;
        }
      } else {
        this.roadwaybreEdit_Obj = {} as RoadwaybreModel;
      }
    }

  ngOnInit(): void {
    this.findLocations();
    this.findTransporties();
    this.generateFirstCostsTable();
    this.findCategoriesByTransport();
    this.findCurrencies();
  }

// ------------------------------------------------------------------------//
// OPERATION ::  REQUESTs - EXTERNAL
// ------------------------------------------------------------------------//

  prepareCategoriesByTransport() {
    this.findCategoriesByTransport();
    if (this.transportEdit_Obj.transport_type === 'Cargo') {
      this.isCargoMix = true;
      this.isPeople = false;
      this.isMixed = false;
    } else if (this.transportEdit_Obj.transport_type === 'Passenger') {
      this.isPeople = true;
      this.isCargoMix = false;
      this.isMixed = false;
    } else if (this.transportEdit_Obj.transport_type === 'Mixed') {
      this.isMixed = true;
      this.isPeople = false;
      this.isCargoMix = false;
    }
  }

  findCategoriesByTransport() {
    let categoriesVet: CategoryModel [] = [];
    this.categoryService.getCategoryByTransport(this.roadwaybreEdit_Obj.transport).subscribe((categoryData: Response) => {
      const categoryDataStr = JSON.stringify(categoryData.body);
      JSON.parse(categoryDataStr, function (key, value) {
        if (key === 'categories') {
          categoriesVet = value;
          return value;
        } else {
          return value;
        }
      });
      this.categories = categoriesVet;
      if (this.categories.length === 0) {
        this.transactionOrchestrator(null, 'Info', 'There is no registered category for this transport');
        this.categories = [];
      }
    });
  }

  findLocations() {
    let locationsVet: LocationModel[] = [];
    this.locationService.getLocation().subscribe((locationsData: Response) =>{
      const locationsStr = JSON.stringify(locationsData.body);
      JSON.parse(locationsStr, function (key, value){
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

  findTransporties() {
    let transportiesVet: TransportTypeModel [] = [];
    this.transportService.get().subscribe((transportTypeData: Response) => {
      const transportTypeDataStr = JSON.stringify(transportTypeData.body);
      JSON.parse(transportTypeDataStr, function (key, value) {
        if (key === 'transports') {
          transportiesVet = value;
          return value;
        } else {
          return value;
        }
      });
      this.transportEdit_Obj = transportiesVet.find(transp => transp.name_transport === this.roadwaybreEdit_Obj.transport);
      this.transporties = transportiesVet;

      if (this.transportEdit_Obj.transport_type === 'Cargo') {
        this.isCargoMix = true;
        this.isPeople = false;
        this.isMixed = false;
      } else if (this.transportEdit_Obj.transport_type === 'Passenger') {
        this.isPeople = true;
        this.isCargoMix = false;
        this.isMixed = false;
      } else if (this.transportEdit_Obj.transport_type === 'Mixed') {
        this.isMixed = true;
        this.isPeople = false;
        this.isCargoMix = false;
      }
    });
  }

  findCurrencies() {
    let currenciesVet: CurrencyModel [] = [];
    this.currencyService.get().subscribe((currencyData: Response) => {
      const currenciesDataStr = JSON.stringify(currencyData.body);
      JSON.parse(currenciesDataStr, function (key, value) {
        if (key === 'currencies') {
          currenciesVet = value;
          return value;
        } else {
           return value;
        }
      });
      this.currencies = currenciesVet;
    });
  }


// ------------------------------------------------------------------------//
// OPERATION ::  TRANSACTION - CRUD
// ------------------------------------------------------------------------//

  prepareUpdate(event: any) {
    const costsArray: CostsModel[] = [];
    let statusChange = false;
    let msgUpdate: string;

    this.costsBRE_DS.forEach( (catCosts) => {
      if ( catCosts.statusChange === false ) {
        statusChange = true;
      }
    });

    if ( statusChange === false ) {
      msgUpdate = 'Do you confirm the change of the registered category data?';
    } else {
      msgUpdate = 'There are costs in the cost table that have a default value of 0.00. Do you still want to save the category?';
    }

    this.confirmationDialogService.confirm('Update', msgUpdate)
    .then((result) => {
      if ( result === true ) {
        this.roadwaybreEdit_Obj.locations.forEach( (location) => {
          this.costsBRE_DS.forEach( (costsObj) => {
            if ( location.countryName === costsObj.countryName ) {
              costsArray.push(costsObj);
            }
          });
        });
        const roadwayEntity: RoadwaybreModel = {
          id: this.roadwaybreEdit_Obj.id,
          name_bre: this.roadwaybreEdit_Obj.name_bre,
          transport: this.roadwaybreEdit_Obj.transport,
          date_creation: this.roadwaybreEdit_Obj.date_creation,
          date_change: new Date(),
          status: this.roadwaybreEdit_Obj.status,
          version:  this.roadwaybreEdit_Obj.version,
          categories: this.roadwaybreEdit_Obj.categories,
          locations: this.roadwaybreEdit_Obj.locations,
          costs: costsArray
        }
        this.update(event, roadwayEntity);
      }
    })
    .catch(() => console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'));
  }

  update(event: any,  entity: RoadwaybreModel){
    this.roadwayBREService.put(entity).subscribe({
      next: data => this.transactionOrchestrator(null, 'Update', 'Update Success'),
      error: error => this.showNotification('bottom', 'center', error, 'error')
    });
  }

  prepareDelete(event: any) {
    this.confirmationDialogService.confirm('Delete', 'Do you confirm the delete of category data?')
    .then((result) => {
      if ( result === true ) {
        this.deleteCategory(event);
      }
    })
    .catch(() => console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'));

  }

  deleteCategory(event: any) {
    console.log(' deleteVehicle ');
    // Transaction Delete
    if (this.roadwaybreEdit_Obj.id != null) {
      this.roadwayBREService.delete(this.roadwaybreEdit_Obj).subscribe({
        next: data => this.transactionOrchestrator(event, 'Delete', 'Delete Success'),
        error: error => this.showNotification('bottom', 'center', error, 'error')
      });
    }
  }

// ------------------------------------------------------------------------//
// OPERATION NOTIFICATION ::
// ------------------------------------------------------------------------//

  transactionOrchestrator(event: any, type: String, msgTransaction: String ) {
    switch (type) {
      case 'Update': {
        type = 'success';
        this.functionRedirectToRoadwayBREView();
        break;
      }
      case 'Delete': {
        type = 'success';
        this.functionRedirectToRoadwayBREView();
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
// OPERATION ::   Transaction Field Value
// ------------------------------------------------------------------------//

  // UPDATE TABLE BY CHANGE CATEGORY  ---------------------//
  onChangeNameBRE() {
    this.roadwaybreEdit_Obj.name_bre = 'BRE-' + this.transportEdit_Obj.name_transport + this.categoryEdit_Obj.name_category;
  }

  // FIELD COUNTRY ---------------------//
  addCountry() {
    let statusCountry = false;
    if (this.roadwaybreEdit_Obj.locations.length > 0) {
      this.roadwaybreEdit_Obj.locations.forEach( (countryObj) => {
        if (countryObj.countryName === this.countryEdit_Obj.countryName) {
          statusCountry = true;
        }
      })
    }
    if ( statusCountry === false ) {
      console.log('countryNew_Obj', this.countryEdit_Obj);
      this.roadwaybreEdit_Obj.locations.push(this.countryEdit_Obj);
      if ( this.costsBRE_DS.length > 0 ) {
        this.generateCostsTable_AddCountry(this.countryEdit_Obj.countryName);
      }
    } else {
      this.transactionOrchestrator(null, 'Validation', 'The selected field is already added');
    }
  }

  removeCountry(countryEditSelect: LocationModel) {
    console.log(' removeCountry() ');
    const error = 'It is not possible to delete a single country that is registered';
    let costsDS_Local: CostsModel[] = [];
    costsDS_Local = this.costsBRE_DS;

    if (this.roadwaybreEdit_Obj.locations.length > 1) {
      const countryObj = this.roadwaybreEdit_Obj.locations.findIndex(country => country.countryName === countryEditSelect.countryName);
      this.roadwaybreEdit_Obj.locations.splice(countryObj, 1);

      if (this.costsBRE_DS.length >= 1) {
        this.costsBRE_DS.forEach(function (countryCosts) {
            const countryCostsObj = costsDS_Local.findIndex(costsCountry => costsCountry.countryName === countryEditSelect.countryName);
            costsDS_Local.splice(countryCostsObj, 1);
        })
      }
      this.costsBRE_DS = costsDS_Local;
    } else if ( this.roadwaybreEdit_Obj.locations.length === 1) {
      this.showNotification('bottom', 'center', error, 'error')
    }
  }

  // FIELD CATEGORY ---------------------//
  addCategory() {
    let statusCategory = false;
    if (this.roadwaybreEdit_Obj.categories.length >= 1) {
      this.roadwaybreEdit_Obj.categories.forEach( (categoryObj) => {
        if (categoryObj.name_category === this.categoryEdit_Obj.name_category) {
          statusCategory = true;
        }
      })
    }

    if ( statusCategory === false ) {
      this.roadwaybreEdit_Obj.categories.push(this.categoryEdit_Obj);
      if ( this.costsBRE_DS.length > 0 ) {
        this.generateCostsTable_AddVehicle(this.categoryEdit_Obj);
      }
    } else {
      this.transactionOrchestrator(null, 'Validation', 'The selected field is already added');
    }
  }

  removeCategory(categoryEditSelect: CategoryModel) {
    console.log(' removeCategory() ');
    const error = 'It is not possible to delete a single category that is registered';
    let costsDS_Local: CostsModel[] = [];
    costsDS_Local = this.costsBRE_DS;
   // const categoriesNew_Vet_L = this.categoriesNew_Vet;

    if (this.roadwaybreEdit_Obj.categories.length > 1) {
      // tslint:disable-next-line:max-line-length
      const categoryObj = this.roadwaybreEdit_Obj.categories.findIndex(category => category.name_category === categoryEditSelect.name_category);
      this.roadwaybreEdit_Obj.categories.splice(categoryObj, 1);

      if (this.costsBRE_DS.length >= 1) {
        this.roadwaybreEdit_Obj.categories.forEach(function (categoryObj) {
          categoryObj.vehicles.forEach(function(vehicleObj) {
            costsDS_Local.forEach(function (costsObj) {
              if ( vehicleObj.category_vehicle === costsObj.vehicle) {
                const categoryObjExclude = costsDS_Local.findIndex(category => category.vehicle === costsObj.vehicle);
                costsDS_Local.splice(categoryObjExclude, 1);
              }
            })
          })
        })
        this.costsBRE_DS = costsDS_Local;
      }
    } else if (  this.roadwaybreEdit_Obj.categories.length === 1) {
        this.showNotification('bottom','center', error, 'error')
    }
  }



// ------------------------------------------------------------------------//
// OPERATION GENERATOR TABLE - COSTS BY COUNTRY
// ------------------------------------------------------------------------//

  generateFirstCostsTable() {
    console.log('generateFirstCostsTable()');
    const valueCosts = 0.00;
    let categoryCostsObj: CostsModel;
    this.isShow = true;
    this.statusEditNew_btn = false;

    const roadwayCosts = this.roadwaybreEdit_Obj.costs;
    console.log('generateFirstCostsTable()', this.roadwaybreEdit_Obj);

    const categoryCosts_L: CostsModel[] = [];
    let countryS: string = null;
    let countryOld: string = null;
    let countrySame = true;
    let statusChange = true;

    const costsCountry = this.roadwaybreEdit_Obj.costs;

    costsCountry.forEach(function (costs) {
      countryS = costs.countryName;
      if ( countryS === countryOld) {
        countrySame = false;
      } else {
        countrySame = true;
      }

      console.log('1234567890', costs.weight_cost);
      if ((costs.weight_cost === valueCosts) || (costs.distance_cost === valueCosts) ||
        (costs.worktime_cost === valueCosts) || (costs.average_consumption_cost === valueCosts)) {
          statusChange = false
      }
      categoryCostsObj = {
        vehicle: costs.vehicle, countryName: costs.countryName,
        weight_cost: costs.weight_cost, distance_cost: costs.distance_cost,
        worktime_cost: costs.worktime_cost, average_consumption_cost: costs.average_consumption_cost,
        currency_symbol: costs.currency_symbol, currency: costs.currency,
        countryNew: countrySame, statusChange: statusChange};

      // Add Object geneate to Array
      categoryCosts_L.push(categoryCostsObj);
      countryOld = countryS;
    })
    this.costsBRE_DS = categoryCosts_L;
  }

  generateCostsTable_AddCountry(countryNameS: string) {
    const valueCosts = 0.00;
    let costsBRE_L: CostsModel[] = [];
    let costsObj: CostsModel;
    let statusNewCountry = false;
    const categories = this.roadwaybreEdit_Obj.categories;
    let index = 0;
    costsBRE_L = this.costsBRE_DS;
    let currencyName = this.currency_Obj.name;
    let currencySymbol = this.currency_Obj.symbol;


    categories.forEach(function (category) {
      category.vehicles.forEach(function (vehicle) {

        if (index === 0) {
          statusNewCountry = true;
        } else {
          statusNewCountry = false;
        }

        costsObj = {
          vehicle: vehicle.category_vehicle, countryName: countryNameS,
          weight_cost: valueCosts, distance_cost: valueCosts,
          worktime_cost: valueCosts, average_consumption_cost: valueCosts,
          currency_symbol: currencySymbol, currency: currencyName,
          countryNew: statusNewCountry, statusChange: false
        };
        costsBRE_L.push(costsObj);
        index++;
      })
    })
    this.costsBRE_DS = costsBRE_L;
  }

  generateCostsTable_AddVehicle(categoryObj: CategoryModel) {
    const valueCosts = 0.00;
    let costsBRE_L: CostsModel[] = [];
    let categoryCostsObj: CostsModel;
    const countries = this.roadwaybreEdit_Obj.locations;
    const categories = this.roadwaybreEdit_Obj.categories;
    costsBRE_L = this.costsBRE_DS;
    let currencyName = this.currency_Obj.name;
    let currencySymbol = this.currency_Obj.symbol;

    countries.forEach(function (country) {
      categoryObj.vehicles.forEach(function (vehicle) {
        categoryCostsObj = {
          vehicle: vehicle.category_vehicle, countryName: country.countryName,
          weight_cost: valueCosts, distance_cost: valueCosts,
          worktime_cost: valueCosts, average_consumption_cost: valueCosts,
          currency_symbol: currencySymbol, currency: currencyName,
          countryNew: false, statusChange: false
        };
        costsBRE_L.push(categoryCostsObj);
      })
    })
    this.costsBRE_DS = costsBRE_L;
  }

// ------------------------------------------------------------------------//
// OPERATION MANAGER TABLE - COSTS BY COUNTRY
// ------------------------------------------------------------------------//

  onChangeCountry(event: any) {
    this.countrySelCosts = null
    this.costsBREII_DS = null;
  }

  onRowEditInit(costsObj: CostsModel) {
    this.clonedCosts[costsObj.vehicle] = {...costsObj};
    console.log('1 clone', this.clonedCosts);
  }

  onRowEditSave(costs: CostsModel) {
    costs.statusChange = true;
  }

  onRowEditCancel(costs: CostsModel, index: number) {
    this.costsBREII_DS[index] = this.clonedCosts[costs.vehicle];
  }
  validateNumber(e: any) {
    const input = String.fromCharCode(e.charCode);
    const reg = /^\d*\.?\d{0,2}$/g;
    if (!reg.test(input)) {
      e.preventDefault();
    }
  }


// ------------------------------------------------------------------------//
// OPERATION REDIRECT
// ------------------------------------------------------------------------//

  functionRedirectToCategories() {
    this.router.navigate(['/category-crud']);
  }

  functionRedirectToRoadwayBREView() {
    this.router.navigate(['/roadway-view']);
  }

  functionRedirectToLocation() {
    this.router.navigate(['/location-crud']);
  }

  functionRedirectToTransport() {
    this.router.navigate(['/transport-crud']);
  }

  functionRedirectToCurrencyView() {
    this.router.navigate(['/currency-crud']);
  }


// ------------------------------------------------------------------------//
// LIFE CYCLE
// ------------------------------------------------------------------------//

  functionPublished() {
    const msg = 'Do you confirm the publication of the business rule that is registered?';
    this.confirmationDialogService.confirm('Change Status', msg)
    .then((result) => {
      this.lifeCycleService.putPublished(this.roadwaybreEdit_Obj.id, this.roadwaybreEdit_Obj.transport).subscribe({
        next: data => this.transactionOrchestrator(null, 'Update', 'Roadway-BRE Published Successfully'),
        error: error => this.showNotification('bottom', 'center', error, 'error')
      });
    });
  }

  functionBlocked() {
    const msg = 'Do you confirm the blocking of the business rule that is already published?';
    this.confirmationDialogService.confirm('Change Status', msg)
    .then((result) => {
      this.lifeCycleService.putBlocked(this.roadwaybreEdit_Obj.id).subscribe({
        next: data => this.transactionOrchestrator(null, 'Update', 'Roadway-BRE Blocked Successfully'),
        error: error => this.showNotification('bottom', 'center', error, 'error')
      });
    });
  }

  functionUnlocked() {
    const msg = 'Do you confirm the unlocking of the business rule that is blocked?';
    this.confirmationDialogService.confirm('Change Status', msg)
    .then((result) => {
      this.lifeCycleService.putUnlocked(this.roadwaybreEdit_Obj.id).subscribe({
        next: data => this.transactionOrchestrator(null, 'Update', 'Roadway-BRE Unlocked Successfully'),
        error: error => this.showNotification('bottom', 'center', error, 'error')
      });
    });
  }

  functionCanceled() {
    const msg = 'Do you confirm the cancellation of the business rule?';
    this.confirmationDialogService.confirm('Change Status', msg)
    .then((result) => {
      this.lifeCycleService.putCanceled(this.roadwaybreEdit_Obj.id).subscribe({
        next: data => this.transactionOrchestrator(null, 'Update', 'Roadway-BRE Canceled Successfully'),
        error: error => this.showNotification('bottom', 'center', error, 'error')
      });
    });
  }

}
