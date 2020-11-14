import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataTO } from 'app/model/dataTO';
import { VehicleModel } from 'app/model/vehicle-model';
import { VehicleTypeService } from 'app/service/vehicle-type.service';
import { VehicleService } from 'app/service/vehicle.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-vehicle-view',
  templateUrl: './vehicle-view.component.html',
  styleUrls: ['./vehicle-view.component.css']
})
export class VehicleViewComponent implements OnInit {

  vehicles: VehicleModel[];
  vehicleOne_Obj = {} as VehicleModel;
  isShow = false;

  constructor(
    private vehicleService: VehicleService,
    private vehicleTypeService: VehicleTypeService,
    private toastr: ToastrService,
    private vehicleTO: DataTO,
    private router: Router) { }

  ngOnInit(): void {
    this.findVehicles();
  }


  // --------- REQUESTs - EXTERNAL ---------------------------------------//

findVehicles() {
  let vehicleVet: VehicleModel[] = [];
  this.vehicleService.getVehicle().subscribe((vehicleData: Response) => {
    const vehicleStr = JSON.stringify(vehicleData.body);
    JSON.parse(vehicleStr, function (key, value) {
      if (key === 'vehicles') {
        vehicleVet = value;
        return value;
      } else {
        return value;
      }
    });
    this.vehicles = vehicleVet;
  });
}


// --------------------------------------------------------------------------------//

selectLocation(event: any, vehicleSelect: any) {
  this.vehicleOne_Obj = vehicleSelect;
}

 // --------- OPERATION TRANSACTION - CRUD ---------------------------------------//

 new() {
  this.vehicleTO.vehicleData = null;
  this.router.navigate(['/vehicle-crud']);
}

edit() {
  this.vehicleTO.vehicleData = this.vehicleOne_Obj;
  this.router.navigate(['/vehicle-crud']);
}




}
