import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LocationModel } from 'app/model/location-model';
import { TransportTypeModel } from 'app/model/transport-type-model';
import { CategoryService } from 'app/service/category.service';
import { ConfirmationDialogService } from 'app/service/confirmation-dialog.service';
import { LocationService } from 'app/service/location.service';
import { TransportTypeService } from 'app/service/transport-type.service';
import { ToastrService } from 'ngx-toastr';
import { CategoryModel } from 'app/model/category-model';
import { CostsModel } from 'app/model/costs-model';
import { RoadwaybreService } from 'app/service/roadwaybre.service';
import { RoadwaybreModel } from 'app/model/roadwaybre-model';
import { StatusModel } from 'app/model/status-model.enum';
import { CurrencyService } from 'app/service/currency.service';
import { LifecycleService } from 'app/service/lifecycle.service';
import { TariffPlanModel } from 'app/model/tariff-plan-model';
import { CurrencyModel } from 'app/model/currency-model';
import { ExchangeService } from 'app/service/exchange.service';
import { DataTO } from 'app/model/dataTO';
import { DOCUMENT } from '@angular/common';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'roadway-new',
  templateUrl: './roadway-new.component.html',
  styleUrls: ['./roadway-new.component.css']
})
export class RoadwayNewComponent implements OnInit {

  // List Another Requests
  categories: CategoryModel[];
  locations: LocationModel[];
  transporties: TransportTypeModel[];
  nameTransport: string = '';
  currencies: CurrencyModel[];
  tariffPlan = {} as TariffPlanModel;
  categoryOne_Obj = {} as CategoryModel;

  // Screen Option
  statusDelete_btn = true;
  statusEditNew_btn = true;
  isShow = false;
  isEdit = false;
  isLocation = true;
  isFromCategory = false;
  editdisabled = true;
  viewButton = false;

  // Category Table View By transport Type
  isCargoMix = false;
  isPeople = false;
  isMixed = false;
  symbol_distance = '$';
  symbol_consumption = 'km/l';
  vlr_dollar_exchange = 0.00;

  // New Object - Entity
  transportNew_Obj = {} as TransportTypeModel;
  currency_Obj = {} as CurrencyModel;
  countryNew_Vet: LocationModel[] = [];
  countryNew_Obj: LocationModel;
  categoriesNew_Vet: CategoryModel[] = [];
  categoryNew_Obj = {} as CategoryModel;
  dateCreationNew_Obj: String;
  dateChangeNew_Obj: String;
  nameBRENew_Obj: String;
  statusNew: String;
  versionNew: String;
  transportOld: String;
  fragile: number;
  persishable: number;
  operationOwnerCost: number;
  employeer_cost: number;
  reshipping_cost: number;
  viewRiskCostsTable = false;
  viewOperationalCostsTable = false;
  viewBasicCostsTable = false;

  // Costs Table
  costsBRE_DS: CostsModel[] = [];
  clonedCosts: { [s: string]: CostsModel; } = {};


  constructor(
    @Inject(DOCUMENT) private _document: Document,
    private categoryData: DataTO,
    private roadwayBREService: RoadwaybreService,
    private categoryService: CategoryService,
    private locationService: LocationService,
    private currencyService: CurrencyService,
    private toastr: ToastrService,
    private lifeCycleService: LifecycleService,
    private exchangeService: ExchangeService,
    private router: Router,
    private transportService: TransportTypeService,
    private confirmationDialogService: ConfirmationDialogService) {

      // From To Category Inc
      if ( this.categoryData.categoryruleData != null ) {
        this.categoryNew_Obj = this.categoryData.categoryruleData;
        this.transportNew_Obj = this.categoryNew_Obj.transport;
        this.nameTransport = this.transportNew_Obj.name_transport;
        this.tariffPlan = this.transportNew_Obj.tariffPlan;
        this.checkTransportType();
        this.isLocation = false;
        this.isFromCategory = true;
        this.addCategory();
        this.onChangeNameBRE();
      } else {
        this.nameBRENew_Obj = 'BRE-';
      }
    }

  ngOnInit(): void {
    this.versionNew = '1.0';
    this.statusNew = StatusModel.Registered;
    this.findLocations();
    this.findTransporties();
    //this.findCurrencies();
    this.findExchange();
  }

// ------------------------------------------------------------------------//
// REQUESTs - EXTERNAL
// ------------------------------------------------------------------------//

  findCategoriesByTransport() {
    let categoriesVet: CategoryModel [] = [];
    this.tariffPlan = this.transportNew_Obj.tariffPlan;
    this.categoryService.getCategoryByTransport(this.transportNew_Obj.name_transport).subscribe((categoryData: Response) => {
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
      if (this.transportOld !== this.transportNew_Obj.name_transport) {
        this.updateFieldByChangeCategory();
        this.transportOld = this.transportNew_Obj.name_transport;
      }
    });
  }

  findExchange() {
    let exchangeValue = 0.00;
    this.exchangeService.getExchange('BRL').subscribe((exchangeData: Response) =>{
    const exchangeStr = JSON.stringify(exchangeData.body);
    JSON.parse(exchangeStr, function (key, value) {
        if (key === 'value') {
          exchangeValue = value;
          console.log('value  Exchange ', exchangeValue);
          return value;
        } else {
          return value;
        }
      });
      this.vlr_dollar_exchange = exchangeValue;
    });
  }

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
      this.transporties = transportiesVet;
    });
  }

  checkTransportType() {
    if (this.transportNew_Obj.transport_type === 'Cargo') {
      this.isCargoMix = true;
      this.isPeople = false;
      this.isMixed = false;
    } else if (this.transportNew_Obj.transport_type === 'Passenger') {
      this.isPeople = true;
      this.isCargoMix = false;
      this.isMixed = false;
    } else if (this.transportNew_Obj.transport_type === 'Mixed') {
      this.isMixed = true;
      this.isPeople = false;
      this.isCargoMix = false;
    }
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
// OPERATION TRANSACTION - CRUD
// ------------------------------------------------------------------------//

  newRecord(event: any) {
    event.resetForm(event);
    this.countryNew_Vet = [];
    this.statusEditNew_btn = true;
    this.statusDelete_btn = true;
    this.costsBRE_DS = [];
    this.clonedCosts = {};
    this.isShow = false;
  }

  prepareSave(event: any) {
    const categoryCostsArray: CostsModel[] = [];
    let statusChange = false;
    let msg: string;

    this.costsBRE_DS.forEach( (catCosts) => {
      if ( catCosts.statusChange === false ) {
        statusChange = true;
      }
    });

    if ( statusChange === false ) {
      msg = 'Deseja incluir a nova regra de negocio?';
    } else {
      msg = 'Existem custos com valor 0.00. Deseja realmente salvar está regra de negocio?';
    }

    this.confirmationDialogService.confirm('Save', msg)
    .then((result) => {
      if ( result === true ) {
        const roadwayBRE_Entity: RoadwaybreModel = {
          id: null,
          name_bre: this.nameBRENew_Obj,
          transport_name: this.transportNew_Obj.name_transport,
          transport: this.transportNew_Obj,
          date_creation: new Date(),
          date_change: null,
          fragile_cost: this.fragile,
          persishable_cost: this.persishable,
          reshipping_cost: this.reshipping_cost,
          operation_cost: this.operationOwnerCost,
          employeer_cost: this.employeer_cost,
          status: this.statusNew,
          version: this.versionNew,
          vlr_exchange: this.vlr_dollar_exchange,
          tariffPlan: this.tariffPlan,
          categories: this.categoriesNew_Vet,
          locations: this.countryNew_Vet,
          costs: this.costsBRE_DS,
        }
        this.saveRoadwayBRE(event, roadwayBRE_Entity);
      }
    })
    .catch(() => console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'));
  }

  saveRoadwayBRE(event: any,  roadatBRE: RoadwaybreModel) {
    this.roadwayBREService.post(roadatBRE).subscribe({
      next: data => this.funcActionDecision(data),
      error: error => this.showNotification('bottom', 'center', error, 'error')
    });
  }

// ------------------------------------------------------------------------//
// OPERATION ::   Transaction Field Value
// ------------------------------------------------------------------------//

  // UPDATE TABLE BY CHANGE CATEGORY  ---------------------//
  onChangeNameBRE() {
    this.nameBRENew_Obj = 'BRE-' + this.categoryNew_Obj.name_category;;
  }


  // UPDATE TABLE BY CHANGE CATEGORY  ---------------------//
  updateFieldByChangeCategory() {
    this.categoriesNew_Vet = [];
   // this.categoryNew_Obj = null;
    this.costsBRE_DS = [];
  }

  // FIELD COUNTRY ---------------------//
  addCountry() {
      let statusCountry = false;
      if (this.countryNew_Vet.length >= 1) {
        this.countryNew_Vet.forEach( (countryObj) => {
        if (countryObj.countryShortName === this.countryNew_Obj.countryShortName) {
          statusCountry = true;
        }
      })
    }

    if ( statusCountry === false ) {
      this.countryNew_Vet.push(this.countryNew_Obj);
      this.isLocation = false;
      if ( this.costsBRE_DS.length > 0 ) {
        this.generateCostsTable_AddCountry(this.countryNew_Obj.countryShortName);
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

    if (this.countryNew_Vet.length > 1) {
      const countryObj = this.countryNew_Vet.findIndex(country => country.countryName === countryEditSelect.countryName);
      this.countryNew_Vet.splice(countryObj, 1);

      if (this.costsBRE_DS.length >= 1){
        this.costsBRE_DS.forEach(function (countryCosts) {
            // tslint:disable-next-line:max-line-length
            const countryCostsObj = costsDS_Local.findIndex(costsCountry => costsCountry.countryName === countryEditSelect.countryName);
            costsDS_Local.splice(countryCostsObj, 1);
        })
      }
      this.costsBRE_DS = costsDS_Local;
    } else if ( this.countryNew_Vet.length === 1) {
      this.showNotification('bottom', 'center', error, 'error')
    }
  }

  // FIELD CATEGORY ---------------------//
  addCategory() {
    let statusCategory = false;
    if (this.categoriesNew_Vet != null) {
      if (this.categoriesNew_Vet.length >= 1) {
        this.categoriesNew_Vet.forEach( (categoryObj) => {
          if (categoryObj.name_category === this.categoryNew_Obj.name_category) {
            statusCategory = true;
          }
        })
      }
    }

    if ( statusCategory === false ) {
      this.categoriesNew_Vet.push(this.categoryNew_Obj);
      this.checkTransportType();
      if ( this.costsBRE_DS.length > 0 ) {
        this.generateCostsTable_AddVehicle(this.categoryNew_Obj);
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
    const categoriesNew_Vet_L = this.categoriesNew_Vet;

    if (this.categoriesNew_Vet.length > 1) {
      const categoryObj = this.categoriesNew_Vet.findIndex(category => category.name_category === categoryEditSelect.name_category);
      this.categoriesNew_Vet.splice(categoryObj, 1);

      if (this.costsBRE_DS.length >= 1) {
        categoriesNew_Vet_L.forEach(function (categoryObj) {
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
    } else if ( this.categoriesNew_Vet.length === 1) {
        this.showNotification('bottom','center', error, 'error')
    }
  }

// ------------------------------------------------------------------------//
// OPERATION UPDATE ::  COSTS TABLES
// ------------------------------------------------------------------------//

generateCostsTable() {
  this.persishable = this.vlr_dollar_exchange;
  this.fragile = this.vlr_dollar_exchange;
  this.reshipping_cost = this.vlr_dollar_exchange;

  if ((this.countryNew_Vet.length === 0) || (this.categoriesNew_Vet.length === 0)) {
    this.transactionOrchestrator(null, 'Validation', 'Existem campos obrigatórios que nao foram preenchidos');
  } else if ((this.countryNew_Vet.length > 0) && (this.categoriesNew_Vet.length > 0)) {
      if (this.tariffPlan.fragile_plan === true || this.tariffPlan.persishable_plan === true) {
        this.viewRiskCostsTable = true;
      } else {
        this.viewRiskCostsTable = false;
      }

      if (this.tariffPlan.reshipping_plan === true || this.tariffPlan.tolls_plan === true) {
        this.viewOperationalCostsTable = true;
      } else {
        this.viewOperationalCostsTable = false;
      }

      if (this.tariffPlan.weight_plan === true || this.tariffPlan.distance_plan === true ||
          this.tariffPlan.dimension_plan === true || this.tariffPlan.fuelconsumption_plan === true ||
          this.tariffPlan.worktime_plan === true) {
        this.viewBasicCostsTable = true;
        this.prepareCostsTable();
      } else {
        this.viewBasicCostsTable = false;
      }
    }
}



prepareCostsTable() {
  console.log('generateCostsTable size countryNew_Vet ', this.countryNew_Vet.length);

  if (( this.countryNew_Vet.length === 0)  && (this.categoriesNew_Vet.length === 0 ) && (this.currency_Obj)) {
    console.log('generateCostsTable - transactionOrchestrator ');
    this.transactionOrchestrator(null, 'Validation', 'The selected field is already added');
  } else {
      this.generateFirstCostsTable();
  }
}

generateFirstCostsTable() {
  const valueCosts = 0.00;
  let categoryCostsObj: CostsModel;
  this.isShow = true;
  this.statusEditNew_btn = false;
  const locations = this.countryNew_Vet;
  const categories = this.categoriesNew_Vet;

  const categoryCosts: CostsModel[] = [];
  let countryS: string = null;
  let countryOld: string = null;
  let countrySame = true;
  const currencyName = this.currency_Obj.name;
  const currencySymbol = this.currency_Obj.symbol;

  locations.forEach(function (location) {
    countryS = location.countryShortName;
    categories.forEach(function (category) {
      category.vehicles.forEach(function (vehicle) {
        if ( countryS === countryOld) {
          countrySame = false;
        } else {
          countrySame = true;
        }
        categoryCostsObj = {
          vehicle: vehicle.category_vehicle, countryName: countryS,
          weight_cost: valueCosts, distance_cost: valueCosts,
          worktime_cost: valueCosts, fuel_type: vehicle.fuel_type, average_consumption_cost: vehicle.fuel_consumption,
          heightDimension_cost: valueCosts, widthDimension_cost: valueCosts, lengthDimension_cost: valueCosts,
          countryNew: countrySame, statusChange: false
        };
        // Add Object geneate to Array
        categoryCosts.push(categoryCostsObj);
        countryOld = countryS;

      })
    })
  })
  this.costsBRE_DS = categoryCosts;
}

generateCostsTable_AddCountry(countryNameS: string) {
  const valueCosts = 0.00;
  let costsBRE_L: CostsModel[] = [];
  let costsObj: CostsModel;
  let statusNewCountry = false;
  const categories = this.categoriesNew_Vet;
  let index = 0;
  costsBRE_L = this.costsBRE_DS;
  const currencyName = this.currency_Obj.name;
  const currencySymbol = this.currency_Obj.symbol;

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
          worktime_cost: valueCosts, fuel_type: vehicle.fuel_type, average_consumption_cost: vehicle.fuel_consumption,
          heightDimension_cost: valueCosts, widthDimension_cost: valueCosts, lengthDimension_cost: valueCosts,
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
  const countries = this.countryNew_Vet;
  const categories = this.countryNew_Vet;
  costsBRE_L = this.costsBRE_DS;
  const currencyName = this.currency_Obj.name;
  const currencySymbol = this.currency_Obj.symbol;


  countries.forEach(function (country) {
    categoryObj.vehicles.forEach(function (vehicle) {
      categoryCostsObj = {
        vehicle: vehicle.category_vehicle, countryName: country.countryShortName,
        weight_cost: valueCosts, distance_cost: valueCosts,
        worktime_cost: valueCosts, fuel_type: vehicle.fuel_type, average_consumption_cost: vehicle.fuel_consumption,
        heightDimension_cost: valueCosts, widthDimension_cost: valueCosts, lengthDimension_cost: valueCosts,
        countryNew: false, statusChange: false
      };
      costsBRE_L.push(categoryCostsObj);
    })
  })
  this.costsBRE_DS = costsBRE_L;
}

// ------------------------------------------------------------------------//
// OPERATION NOTIFICATION ::
// ------------------------------------------------------------------------//

  transactionOrchestrator(event: any, type: String, msgTransaction: String ) {
    switch (type) {
      case 'Save': {
        type = 'success';
        this.functionRedirectToRoadwayBREView()
        break;
      }
      case 'Update': {
        type = 'success';
        this.functionRedirectToRoadwayBREView()
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
// LIFE CYCLE
// ------------------------------------------------------------------------//

funcActionDecision(roadwayObj: Response) {
  const msg = 'Deseja publicar para uso a regra de negocio que está registrada?'
  this.confirmationDialogService.confirm('Publicar BRE', msg)
  .then((result) => {
    if ( result === true ) {
      this.funcParseRoadwayToPublish(roadwayObj);
    } else {
       this.functionRedirectToRoadwayBREView();
    }
  })
}

funcParseRoadwayToPublish(roadwayData: Response){
  let id = '';
  const roadwayDataStr = JSON.stringify(roadwayData.body);
  JSON.parse(roadwayDataStr, function (key, value) {

    if (key === 'id') {
      console.log('id', value);
      if (value != null) {
        id = value;
      }
      return value;
    } else {
        return value;
    }
  });
  this.functionPublished(id);
}

functionPublished(id: String) {
  this.lifeCycleService.putPublished(id, this.transportNew_Obj.name_transport).subscribe({
    next: data => this.transactionOrchestrator(null, 'Update', 'Regras de Negocio publicada com sucesso'),
    error: error => this.showNotification('bottom', 'center', error, 'error')
  })
}

// ------------------------------------------------------------------------//
// OPERATION REDIRECT ::
// ------------------------------------------------------------------------//

  functionRedirectToCurrencyView() {
    this.router.navigate(['/currency-crud']);
  }

  functionRedirectToRoadwayBREView() {
    this.categoryData.categoryruleData = null
    this.router.navigate(['/roadway-view']);
  }

  functionRedirectToLocation() {
    this.router.navigate(['/location-view']);
  }

  functionRedirectToCategories() {
    this.router.navigate(['/category-view']);
  }

  functionRedirectToTransport() {
    this.router.navigate(['/transport-view']);
  }


//------------------------------------------------------------------------//
// OPERATION CRUD :: COSTS TABLE
//------------------------------------------------------------------------//

  onRowEditInit(costsObj: CostsModel) {
    this.clonedCosts[costsObj.vehicle] = {...costsObj};
  }
  onRowEditSave(costs: CostsModel, index: number) {
    costs.statusChange = true;
  }
  onRowEditCancel(costs: CostsModel, index: number) {
    this.costsBRE_DS[index] = this.clonedCosts[costs.vehicle];
  }
  validateNumber(e: any) {
    const input = String.fromCharCode(e.charCode);
    const reg = /^\d*\.?\d{0,2}$/g;
    if (!reg.test(input)) {
      e.preventDefault();
    }
  }

}
