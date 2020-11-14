import { VehicleModel } from './vehicle-model';
import { CategoryModel } from 'app/model/category-model';
import { Injectable } from '@angular/core';
import { RoadwaybreModel } from './roadwaybre-model';
import { BodyworkModel } from './bodywork-model';

@Injectable()
export class DataTO {

  public categoryruleData: CategoryModel;
  public roadwayBREData: RoadwaybreModel;
  public vehicleData: VehicleModel;

  public constructor() { }

}
