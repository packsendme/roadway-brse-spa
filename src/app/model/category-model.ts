import { CategoryCostsModel } from './category-costs-model';
import { CategoryTypeModel } from './category-type-model';
import { LocationModel } from './location-model';
import { VehicleModel } from './vehicle-model';

export interface CategoryModel {
  id: string;
  categoryType: CategoryTypeModel;
  vehicles: [VehicleModel];
  locations: [LocationModel];
  categoryCosts: Map<String, CategoryCostsModel[]>;
}
