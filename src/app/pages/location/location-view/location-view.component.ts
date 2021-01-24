import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { DataTO } from 'app/model/dataTO';
import { LocationModel } from 'app/model/location-model';
import { LocationService } from 'app/service/location.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-location-view',
  templateUrl: './location-view.component.html',
  styleUrls: ['./location-view.component.css']
})
export class LocationViewComponent implements OnInit {

  locations: LocationModel[];
  locatioOne_Obj = {} as LocationModel;
  isDisabled = true;

  constructor(
    private locationService: LocationService,
    private toastr: ToastrService,
    private locationTO: DataTO,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.findLocations();
  }

// --------- REQUESTs - EXTERNAL ---------------------------------------//

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

// --------- TRANSACTION - CRUD ---------------------------------------//

  selectLocation(event: any, locationSelect: any) {
    this.isDisabled = false;
    this.locatioOne_Obj = locationSelect;
  }

   // --------- OPERATION TRANSACTION - CRUD ---------------------------------------//

  new() {
    this.locationTO.locationData = null;
    this.router.navigate(['/location-crud']);
  }

  edit() {
    this.locationTO.locationData = this.locatioOne_Obj;
    this.router.navigate(['/location-crud']);
  }

}
