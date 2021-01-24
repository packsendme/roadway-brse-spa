import { CategoryModel } from './category-model';
import { CostsModel } from './costs-model';
import { LocationModel } from './location-model';

export interface RoadwaybreModel {
  id: String;
  name_bre: String;
  transport: String;
  date_creation: Date;
  date_change: Date;
  status: String;
  version: String;
  categories: CategoryModel[];
  locations: LocationModel[];
  costs: CostsModel[];
}
