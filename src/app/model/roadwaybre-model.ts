import { TransportTypeModel } from 'app/model/transport-type-model';
import { CategoryModel } from './category-model';
import { CostsModel } from './costs-model';
import { LocationModel } from './location-model';
import { TariffPlanModel } from './tariff-plan-model';

export interface RoadwaybreModel {
  id: String;
  name_bre: String;
  transport_name: string;
  date_creation: Date;
  date_change: Date;
  fragile_cost: number;
  persishable_cost: number;
  reshipping_cost: number;
  operation_cost: number;
  employeer_cost: number;
  vlr_exchange: number;
  status: String;
  version: String;
  transport: TransportTypeModel;
  tariffPlan: TariffPlanModel;
  categories: CategoryModel[];
  costs: CostsModel[];
  locations: LocationModel[];
}
