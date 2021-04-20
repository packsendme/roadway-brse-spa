import { TariffPlanModel } from "./tariff-plan-model";

export interface TransportTypeModel {
  id: string;
  name_transport: string;
  identifier: string;
  initials: string;
  transport_type: string;
  coditions: string;
  restriction: boolean;
	weight_max: number;
  unity_weight: {};
	heightDimension_max: number;
	widthDimension_max: number;
	lengthDimension_max: number;
  tariffPlan: TariffPlanModel;
}
