import { CategoryTypeModel } from 'app/model/category-type-model';
import { CategoryCostsModel } from './category-costs-model';
import { LocationModel } from './location-model';
import { VehicleModel } from './vehicle-model';
export interface CategoryRuleModel {
    id: string;
    categoryType: CategoryTypeModel;
    vehicles: VehicleModel[];
    locations: LocationModel[];
    categoryCosts: CategoryCostsModel[];
}
