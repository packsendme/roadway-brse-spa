import { TransportTypeModel } from 'app/model/transport-type-model';
import { VehicleModel } from './vehicle-model';
export interface CategoryModel {
    id: string;
    name_category: string;
    initials: string;
    transport_name: string;
    transport: TransportTypeModel;
    weightUnityVehicle_max: string;
    weightUnityTransport_max: string;
    people_max: number;
    vehicles: VehicleModel[];
    dt_inc: Date;
    dt_update: Date;
}
