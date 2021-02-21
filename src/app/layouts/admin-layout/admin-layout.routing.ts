import { VehicleclassificationCrudComponent } from './../../pages/vehicle/core/vehicleclassification-crud/vehicleclassification-crud.component';
import { FueltollsCrudComponent } from './../../pages/fueltolls/fueltolls-crud/fueltolls-crud.component';
import { FueltollsViewComponent } from './../../pages/fueltolls/fueltolls-view/fueltolls-view.component';
import { UnitymeasurementCrudComponent } from '../../pages/category/unitymeasurement/unitymeasurement-crud/unitymeasurement-crud.component';
import { BodyworkCrudComponent } from './../../pages/vehicle/bodywork/bodywork-crud/bodywork-crud.component';
import { Routes } from '@angular/router';
import { VehicleCrudComponent } from 'app/pages/vehicle/core/vehicle-crud/vehicle-crud.component';
import { VehicleViewComponent } from 'app/pages/vehicle/core/vehicle-view/vehicle-view.component';
import { InitialsCrudComponent } from 'app/pages/transport/initials/initials-crud/initials-crud.component';
import { TransportViewComponent } from 'app/pages/transport/core/transport-view/transport-view.component';
import { TransportCrudComponent } from 'app/pages/transport/core/transport-crud/transport-crud.component';
import { LocationViewComponent } from 'app/pages/location/location-view/location-view.component';
import { LocationCrudComponent } from 'app/pages/location/location-crud/location-crud.component';
import { CategoryViewComponent } from 'app/pages/category/core/category-view/category-view.component';
import { CategoryCrudComponent } from 'app/pages/category/core/category-crud/category-crud.component';
import { RoadwayViewComponent } from 'app/pages/roadway/core/roadway-view/roadway-view.component';
import { RoadwayNewComponent } from 'app/pages/roadway/core/roadway-new/roadway-new.component';
import { RoadwayUpdateComponent } from 'app/pages/roadway/core/roadway-update/roadway-update.component';
import { CurrencyCrudComponent } from 'app/pages/roadway/currency/currency-crud/currency-crud.component';
import { SimulationViewComponent } from 'app/pages/simulation/simulation-view/simulation-view.component';
import { SimulationCrudComponent } from 'app/pages/simulation/simulation-crud/simulation-crud.component';
import { VehicletypeCrudComponent } from 'app/pages/vehicle/core/vehicletype-crud/vehicletype-crud.component';

export const AdminLayoutRoutes: Routes = [
    { path: 'location-view',       component: LocationViewComponent },
    { path: 'location-crud',       component: LocationCrudComponent },
    { path: 'vehicle-crud',        component: VehicleCrudComponent },
    { path: 'vehicle-view',        component: VehicleViewComponent },
    { path: 'vehicleclassification-crud',    component: VehicleclassificationCrudComponent },
    { path: 'vehicletype-crud',    component: VehicletypeCrudComponent },
    { path: 'category-crud',        component: CategoryCrudComponent },
    { path: 'category-view',       component: CategoryViewComponent },
    { path: 'transport-view',      component: TransportViewComponent },
    { path: 'transport-crud',      component: TransportCrudComponent },
    { path: 'bodywork-crud',       component: BodyworkCrudComponent },
    { path: 'roadway-view',        component: RoadwayViewComponent },
    { path: 'roadway-new',         component: RoadwayNewComponent },
    { path: 'roadway-update',      component: RoadwayUpdateComponent },
    { path: 'currency-crud',        component: CurrencyCrudComponent },
    { path: 'unitymeasurement-crud', component: UnitymeasurementCrudComponent },
    { path: 'initials-crud',       component: InitialsCrudComponent },
    { path: 'simulation-view',       component: SimulationViewComponent },
    { path: 'simulation-crud',       component: SimulationCrudComponent },
    { path: 'fueltolls-view',       component: FueltollsViewComponent },
    { path: 'fueltolls-crud',       component: FueltollsCrudComponent },
];
