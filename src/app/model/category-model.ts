import { VehicleModel } from './vehicle-model';
export interface CategoryModel {
    id: string;
    name_category: string;
    transport: string;
    weight_max: number;
    people_max: number;
    unity_weight: {};
    vehicles: VehicleModel[];
    dt_inc: Date;
    dt_update: Date;
}
