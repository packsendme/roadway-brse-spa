import { LocationService } from './../../../service/location.service';
import { TollsFuelModel } from './../../../model/tolls-fuel-model';
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { TollsfuelService } from 'app/service/tollsfuel.service';
import { DataTO } from 'app/model/dataTO';
import { Router, ActivatedRoute } from '@angular/router';
import { LocationModel } from 'app/model/location-model';

@Component({
  selector: 'app-fueltolls-view',
  templateUrl: './fueltolls-view.component.html',
  styleUrls: ['./fueltolls-view.component.css']
})
export class FueltollsViewComponent implements OnInit {

  tollsFuelVet = {} as TollsFuelModel;
  locations: LocationModel[];
  locationOne_Obj = {} as LocationModel;

  tollsfuelOne_Obj = {} as TollsFuelModel;
  isDisabled = true;

  constructor(
    private tollsfuelService: TollsfuelService,
    private toastr: ToastrService,
    private tollsfuelTO: DataTO,
    private locationService: LocationService,
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

  findTollsFuelByCountry() {
    console.log('locations', this.locationOne_Obj.countryName);
    this.tollsfuelService.get(this.locationOne_Obj.countryShortName).subscribe((tollsfuelData: Response) => {
      const tollsfuelStr = JSON.stringify(tollsfuelData.body);
      const jsonObject: any = JSON.parse(tollsfuelStr);
      const tollsFuel_Obj: TollsFuelModel = <TollsFuelModel>jsonObject;
      this.tollsFuelVet = tollsFuel_Obj;
      });
  }

// --------- TRANSACTION - CRUD ---------------------------------------//

  select(event: any, obj: any) {
    this.isDisabled = false;
    this.tollsfuelOne_Obj = obj;
    console.log('123456', this.tollsfuelOne_Obj.country);
  }

   // --------- OPERATION TRANSACTION - CRUD ---------------------------------------//

  new() {
    this.tollsfuelTO.tollsfuelData = null;
    this.router.navigate(['/fueltolls-crud']);
  }

  edit() {
    console.log(' FUELTOLLS ', this.tollsfuelOne_Obj.country);
    this.tollsfuelTO.tollsfuelData = this.tollsfuelOne_Obj;
    this.router.navigate(['/fueltolls-crud']);
  }

}
