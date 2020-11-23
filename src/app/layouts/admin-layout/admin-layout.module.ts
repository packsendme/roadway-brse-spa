import { VehicleViewComponent } from './../../pages/vehicle/core/vehicle-view/vehicle-view.component';
import { VehicletypeCrudComponent } from '../../pages/vehicle/core/vehicletype-crud/vehicletype-crud.component';
import { BodyworkCrudComponent } from './../../pages/vehicle/bodywork/bodywork-crud/bodywork-crud.component';
import { DataTO } from './../../model/dataTO';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminLayoutRoutes } from './admin-layout.routing';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { LayoutModule } from '@angular/cdk/layout';
import {MatIconModule} from '@angular/material/icon';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import {TableModule} from 'primeng/table';
import {ButtonModule} from 'primeng/button';
import { BusinessruleNewComponent } from 'app/pages/bre/businessrule-new/businessrule-new.component';
import { BusinessruleViewComponent } from 'app/pages/bre/businessrule-view/businessrule-view.component';
import { BusinessruleUpdateComponent } from 'app/pages/bre/businessrule-update/businessrule-update.component';
import { VehicleCrudComponent } from 'app/pages/vehicle/core/vehicle-crud/vehicle-crud.component';
import { ConfirmationDialogComponent } from 'app/pages/confirmation-dialog/confirmation-dialog.component';
import { InitialsCrudComponent } from 'app/pages/transport/initials/initials-crud/initials-crud.component';
import { TransportViewComponent } from 'app/pages/transport/core/transport-view/transport-view.component';
import { TransportCrudComponent } from 'app/pages/transport/core/transport-crud/transport-crud.component';
import { LocationCrudComponent } from 'app/pages/location/location-crud/location-crud.component';
import { LocationViewComponent } from 'app/pages/location/location-view/location-view.component';
import { CategoryNewComponent } from 'app/pages/category/core/category-new/category-new.component';
import { CategoryViewComponent } from 'app/pages/category/core/category-view/category-view.component';
import { CategoryUpdateComponent } from 'app/pages/category/core/category-update/category-update.component';
import { UnitymeasurementCrudComponent } from 'app/pages/category/unitymeasurement/unitymeasurement-crud/unitymeasurement-crud.component';
@NgModule({
  imports: [
    LayoutModule,
    MatAutocompleteModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatTableModule,
    ButtonModule,
    MatRadioModule,
    MatSelectModule,
    MatSliderModule,
    CommonModule,
    RouterModule.forChild(AdminLayoutRoutes),
    FormsModule,
    NgbModule,
    MatTableModule,
    MatIconModule,
    TableModule
    ],
  providers: [DataTO],

  declarations: [
    LocationCrudComponent,
    VehicleCrudComponent,
    VehicleViewComponent,
    CategoryNewComponent,
    CategoryViewComponent,
    CategoryUpdateComponent,
    BusinessruleNewComponent,
    BusinessruleViewComponent,
    BusinessruleUpdateComponent,
    VehicletypeCrudComponent,
    BodyworkCrudComponent,
    TransportViewComponent,
    ConfirmationDialogComponent,
    TransportCrudComponent,
    InitialsCrudComponent,
    LocationViewComponent,
    UnitymeasurementCrudComponent
  ]
})

export class AdminLayoutModule {}
