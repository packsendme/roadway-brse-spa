import { Routes } from '@angular/router';
import { UserComponent } from '../../pages/user/user.component';
import { TableComponent } from '../../pages/table/table.component';
import { TypographyComponent } from '../../pages/typography/typography.component';
import { IconsComponent } from '../../pages/icons/icons.component';
import { MapsComponent } from '../../pages/maps/maps.component';
import { NotificationsComponent } from '../../pages/notifications/notifications.component';
import { UpgradeComponent } from '../../pages/upgrade/upgrade.component';
import { LocationComponent } from 'app/pages/location/location.component';
import { VehicleComponent } from 'app/pages/vehicle/vehicle.component';
import { VehicletypeComponent } from 'app/pages/vehicletype/vehicletype.component';

export const AdminLayoutRoutes: Routes = [
    { path: 'location',       component: LocationComponent },
    { path: 'vehicle',        component: VehicleComponent },
    { path: 'vehicletype',    component: VehicletypeComponent },
    { path: 'user',           component: UserComponent },
    { path: 'table',          component: TableComponent },
    { path: 'typography',     component: TypographyComponent },
    { path: 'icons',          component: IconsComponent },
    { path: 'maps',           component: MapsComponent },
    { path: 'notifications',  component: NotificationsComponent },
    { path: 'upgrade',        component: UpgradeComponent }
];
