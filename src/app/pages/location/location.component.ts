import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Location } from './../../model/Location';
import { LocationService } from './../../service/location.service';
import { Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import { ToastrService } from "ngx-toastr";
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.css']
})
export class LocationComponent implements OnInit {
  locations: Location[];
  locatioOne_Obj = {} as Location;
  statusDelete_btn = true;
  statusNew_btn = true;

  constructor(private locationService: LocationService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.findLocations();
   }


   findLocations(){
    let locationsVet: Location[] = [];
    this.locationService.getLocation().subscribe((locationsData: Response) =>{
      const locationsStr = JSON.stringify(locationsData.body);
      JSON.parse(locationsStr, function (key, value){
        if(key === 'locations'){
          locationsVet = value;
          return value;
        } else {
          return value;
        }
      });
      this.locations = locationsVet;
    });
  }

  selectLocation(event: any, locationSelect:any){
    this.statusDelete_btn = false;
    this.statusNew_btn = false;
    this.locatioOne_Obj = locationSelect;
  }

  newRecord(event: any){
    console.log("newRecord");
    event.resetForm(event);
    this.locatioOne_Obj = {} as Location;
    this.statusNew_btn = true;
    this.statusDelete_btn = true;
  }

  saveEditLocation(event: any){
    console.log(' saveEditLocation ');

    // Transaction Save
    if(this.locatioOne_Obj.id == null){
      this.locationService.postLocation(this.locatioOne_Obj).subscribe({
        next: data => this.transactionOrchestrator(event, 'Save'),
        error: error => this.showNotification('bottom','center', error, 'error')
      });
    }
    // Transaction Update
    else if(this.locatioOne_Obj.id != null){
      this.locationService.putLocation(this.locatioOne_Obj).subscribe({
        next: data => this.transactionOrchestrator(event, 'Update'),
        error: error => this.showNotification('bottom','center', error, 'error')
      });
    }
    this.statusDelete_btn = true;
  }

  deleteLocation(event: any){
    console.log(' deleteLocation ');
    this.statusDelete_btn = true;
    this.statusNew_btn = true;
    // Transaction Delete
    if(this.locatioOne_Obj.id != null){
      this.locationService.deleteLocation(this.locatioOne_Obj).subscribe({
        next: data => this.transactionOrchestrator(event, 'Delete'),
        error: error => this.showNotification('bottom','center', error, 'error')
      });
    }
  }

  transactionOrchestrator(event: any, type: String) {
    let msgTransaction = '' as  String;
    switch (type) {
      case 'Save': {
        msgTransaction = 'Register Success';
      }
      case 'Update': {
        msgTransaction = 'Update Success';
      }
      case 'Delete': {
        msgTransaction = 'Delete Success';
      }
    }
    this.findLocations()
    this.showNotification('bottom','center', msgTransaction, 'success')
    event.resetForm(event);
    this.locatioOne_Obj = {} as Location;
  }

  handleClear(f: NgForm){
    console.log(" CLEAN");
    f.resetForm();
  }

  showNotification(from, align, msg, type) {
    const color = Math.floor(Math.random() * 5 + 1);
    switch (type) {
      case 'success':
        this.toastr.success(
          '<span data-notify="icon" class="nc-icon nc-bell-55"></span><span data-notify="message">'+ msg +'</span>',
          "",
          {
            timeOut: 4000,
            closeButton: true,
            enableHtml: true,
            toastClass: "alert alert-success alert-with-icon",
            positionClass: "toast-" + from + "-" + align
          }
        );
        break;
      case 'error':
        this.toastr.error(
          '<span data-notify="icon" class="nc-icon nc-bell-55"></span><span data-notify="message">'+ msg +'</span>',
          "",
          {
            timeOut: 4000,
            enableHtml: true,
            closeButton: true,
            toastClass: "alert alert-danger alert-with-icon",
            positionClass: "toast-" + from + "-" + align
          }
        );
        break;
      default:
        break;
    }
  }

}
