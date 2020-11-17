import { LocationModel } from 'app/model/location-model';
import { TransportTypeModel } from 'app/model/transport-type-model';
import { VehicleModel } from './vehicle-model';
import { CategoryModel } from 'app/model/category-model';
import { Injectable } from '@angular/core';
import { RoadwaybreModel } from './roadwaybre-model';
@Injectable()
export class DataTO {

  public categoryruleData: CategoryModel;
  public roadwayBREData: RoadwaybreModel;
  public vehicleData: VehicleModel;
  public transportData: TransportTypeModel;
  public locationData: LocationModel;

  public constructor() { }

}
