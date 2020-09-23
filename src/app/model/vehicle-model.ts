import { BodyWorkModel } from './body-work-model';

export interface VehicleModel {
  id: string;
  vehicle_type: string;
  bodywork_vehicle: [string];
  cargo_max: number;
  axis_total: number;
  unity_measurement_weight: string;
  people_transport: boolean;
  people: string
}
