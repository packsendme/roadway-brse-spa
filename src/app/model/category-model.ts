import { VehicleModel } from './vehicle-model';
export interface CategoryModel {
    id: string;
    name_category: string;
    transport: string;
    weight_max: number;
    unity: string;
    people_max: number;
    vehicles: VehicleModel[];
}
