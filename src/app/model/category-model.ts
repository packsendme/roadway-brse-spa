import { VehicleModel } from './vehicle-model';
export interface CategoryModel {
    id: string;
    name_category: string;
    transport: string;
    weight_min: string;
    weight_max: string;
    unity_measurement_weight_min: string;
    unity_measurement_weight_max: string;
    vehicles: VehicleModel[];
}
