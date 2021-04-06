import { CategoryModel } from './category-model';
import { CostsModel } from './costs-model';
import { LocationModel } from './location-model';
import { TariffPlanModel } from './tariff-plan-model';

export interface RoadwaybreModel {
  id: String;
  name_bre: String;
  transport: String;
  date_creation: Date;
  date_change: Date;
  fragile_cost: number;
  persishable_cost: number;
  reshipping_cost: number;
  operation_cost: number;
  employeer_cost: number;
  status: String;
  version: String;
  tariffPlan: TariffPlanModel;
  categories: CategoryModel[];
  costs: CostsModel[];
  locations: LocationModel[];
}
