import { TransportCrudComponent } from '../../pages/transport/transport-crud/transport-crud.component';
import { TransportViewComponent } from './../../pages/transport/transport-view/transport-view.component';
import { BodyworkCrudComponent } from './../../pages/vehicle/bodywork/bodywork-crud/bodywork-crud.component';
import { BusinessruleUpdateComponent } from 'app/pages/bre/businessrule-update/businessrule-update.component';
import { Routes } from '@angular/router';
import { LocationComponent } from 'app/pages/location/location.component';
import { CategorynewComponent } from 'app/pages/category/categorynew/categorynew.component';
import { CategoriesComponent } from 'app/pages/category/categories/categories.component';
import { CategoryupdateComponent } from 'app/pages/category/categoryupdate/categoryupdate.component';
import { BusinessruleViewComponent } from 'app/pages/bre/businessrule-view/businessrule-view.component';
import { BusinessruleNewComponent } from 'app/pages/bre/businessrule-new/businessrule-new.component';
import { VehicleCrudComponent } from 'app/pages/vehicle/core/vehicle-crud/vehicle-crud.component';
import { VehicletypeCrudComponent } from 'app/pages/vehicle/core/vehicletype-crud/vehicletype-crud.component';
import { VehicleViewComponent } from 'app/pages/vehicle/core/vehicle-view/vehicle-view.component';

export const AdminLayoutRoutes: Routes = [
    { path: 'location',           component: LocationComponent },
    { path: 'vehicle-crud',       component: VehicleCrudComponent },
    { path: 'vehicle-view',       component: VehicleViewComponent },
    { path: 'vehicletype-crud',   component: VehicletypeCrudComponent },
    { path: 'categorynew',        component: CategorynewComponent },
    { path: 'categories',         component: CategoriesComponent },
    { path: 'categoryupdate',     component: CategoryupdateComponent },
    { path: 'transport-view',     component: TransportViewComponent },
    { path: 'transport-crud',     component: TransportCrudComponent },
    { path: 'bodywork-crud',      component: BodyworkCrudComponent },
    { path: 'businessrule-view',  component: BusinessruleViewComponent },
    { path: 'businessrule-new',   component: BusinessruleNewComponent },
    { path: 'businessrule-update',component: BusinessruleUpdateComponent }
];
