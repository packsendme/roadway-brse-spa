import { TariffPlanModel } from "./tariff-plan-model";

export interface TransportTypeModel {
  id: string;
  name_transport: string;
  identifier: string;
  initials: string;
  transport_type: string;
  tariffPlan: TariffPlanModel;
}
