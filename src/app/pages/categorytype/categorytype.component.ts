import { TransportTypeModel } from './../../model/transport-type-model';
import { Component, OnInit } from '@angular/core';
import { CategoryTypeModel } from 'app/model/category-type-model';
import { CategoryTypeService } from 'app/service/category-type.service';
import { ToastrService } from 'ngx-toastr';
import { NgForm } from '@angular/forms';
import { TransportTypeService } from 'app/service/transport-type.service';
import { Router } from '@angular/router';
import { UnityMeasurementModel } from 'app/model/unity-measurement-model';
import { UnityMeasurementService } from 'app/service/unity-measurement.service';

@Component({
  selector: 'app-categorytype',
  templateUrl: './categorytype.component.html',
  styleUrls: ['./categorytype.component.css']
})
export class CategorytypeComponent implements OnInit {

  // List Another Requests
  categoriesTypes: CategoryTypeModel[];
  transportiesTypes: TransportTypeModel[];
  unityMeasurements: UnityMeasurementModel[];

  // Screen Option
  categoryTypeOne_Obj = {} as CategoryTypeModel;
  statusDelete_btn = true;
  statusNew_btn = true;

  constructor(
    private categoryTypeService: CategoryTypeService,
    private transportTypeService: TransportTypeService,
    private toastr: ToastrService,
    private unityMeasurementService: UnityMeasurementService,
    private router: Router) { }

  ngOnInit(): void {
    this.findCategoriesType();
    this.findTransportiesType();
    this.findUnityMeasurement();

  }

  //--------- REQUESTs - EXTERNAL ---------------------------------------//

  findCategoriesType() {
    let categoriesVet: CategoryTypeModel [] = [];
    this.categoryTypeService.getCategoryType().subscribe((categoryTypeData: Response) => {
      const categoryTypeDataStr = JSON.stringify(categoryTypeData.body);
      JSON.parse(categoryTypeDataStr, function (key, value) {
        if (key === 'categoriesType') {
          categoriesVet = value;
          return value;
        } else {
           return value;
        }
      });
      this.categoriesTypes = categoriesVet;
    });
  }

  findTransportiesType() {
    let transportiesVet: TransportTypeModel [] = [];
    this.transportTypeService.getTransportType().subscribe((transportTypeData: Response) => {
      const transportTypeDataStr = JSON.stringify(transportTypeData.body);
      JSON.parse(transportTypeDataStr, function (key, value) {
        if (key === 'transporties') {
          transportiesVet = value;
          return value;
        } else {
           return value;
        }
      });
      this.transportiesTypes = transportiesVet;
    });
  }

  findUnityMeasurement() {
    let unityMeasurementVet: UnityMeasurementModel[] = [];
    this.unityMeasurementService.getUnityMeasurement().subscribe((unityMeasurementData: Response) => {
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


  // --------- OPERATION TRANSACTION - CRUD ---------------------------------------//

  newRecord(event: any){
    event.resetForm(event);
    this.categoryTypeOne_Obj = {} as CategoryTypeModel;
    this.statusNew_btn = true;
    this.statusDelete_btn = true;
  }

  saveEditCategoryType(event: any){
    // Transaction Save
    if (this.categoryTypeOne_Obj.id == null) {
      this.categoryTypeService.postCategoryType(this.categoryTypeOne_Obj).subscribe({
        next: data => this.transactionOrchestrator(event, 'Save'),
        error: error => this.showNotification('bottom','center', error, 'error')
      });
    } else if (this.categoryTypeOne_Obj.id != null) {
      this.categoryTypeService.putCategoryType(this.categoryTypeOne_Obj).subscribe({
        next: data => this.transactionOrchestrator(event, 'Update'),
        error: error => this.showNotification('bottom','center', error, 'error')
      });
    }
    this.statusDelete_btn = true;
  }

  deleteCategoryType(event: any){
    console.log(' deleteVehicle ');
    this.statusDelete_btn = true;
    this.statusNew_btn = true;
    // Transaction Delete
    if (this.categoryTypeOne_Obj.id != null) {
      this.categoryTypeService.deleteCategoryType(this.categoryTypeOne_Obj).subscribe({
        next: data => this.transactionOrchestrator(event, 'Delete'),
        error: error => this.showNotification('bottom', 'center', error, 'error')
      });
    }
  }

// --------------------------------------------------------------------------------//

selectCategory(event: any, categoryTypeSelect:any){
  this.statusDelete_btn = false;
  this.statusNew_btn = false;
  this.categoryTypeOne_Obj = categoryTypeSelect;
}

transactionOrchestrator(event: any, type: String) {
    let msgTransaction = '' as  String;
    switch (type) {
      case 'Save': {
        msgTransaction = 'Register Success';
      }
      // tslint:disable-next-line:no-switch-case-fall-through
      case 'Update': {
        msgTransaction = 'Update Success';
      }
      // tslint:disable-next-line:no-switch-case-fall-through
      case 'Delete': {
        msgTransaction = 'Delete Success';
      }
    }
    this.findCategoriesType()
    this.showNotification('bottom', 'center', msgTransaction, 'success')
    event.resetForm(event);
    this.categoryTypeOne_Obj = {} as CategoryTypeModel;
  }

  handleClear(f: NgForm){
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

  functionRedirectToTransportType(){
    this.router.navigate(['/transport']);
  }


}
