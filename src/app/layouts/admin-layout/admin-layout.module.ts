import { VehicleViewComponent } from './../../pages/vehicle/core/vehicle-view/vehicle-view.component';
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
import { VehicleCrudComponent } from 'app/pages/vehicle/core/vehicle-crud/vehicle-crud.component';
import { ConfirmationDialogComponent } from 'app/pages/confirmation-dialog/confirmation-dialog.component';
import { InitialsCrudComponent } from 'app/pages/transport/initials/initials-crud/initials-crud.component';
import { TransportViewComponent } from 'app/pages/transport/core/transport-view/transport-view.component';
import { TransportCrudComponent } from 'app/pages/transport/core/transport-crud/transport-crud.component';
import { LocationCrudComponent } from 'app/pages/location/location-crud/location-crud.component';
import { LocationViewComponent } from 'app/pages/location/location-view/location-view.component';
import { CategoryViewComponent } from 'app/pages/category/core/category-view/category-view.component';
import { UnitymeasurementCrudComponent } from 'app/pages/category/unitymeasurement/unitymeasurement-crud/unitymeasurement-crud.component';
import { CategoryCrudComponent } from 'app/pages/category/core/category-crud/category-crud.component';
import { RoadwayNewComponent } from 'app/pages/roadway/core/roadway-new/roadway-new.component';
import { RoadwayViewComponent } from 'app/pages/roadway/core/roadway-view/roadway-view.component';
import { RoadwayUpdateComponent } from 'app/pages/roadway/core/roadway-update/roadway-update.component';
import { CurrencyCrudComponent } from 'app/pages/roadway/currency/currency-crud/currency-crud.component';
import { SimulationViewComponent } from 'app/pages/simulation/simulation-view/simulation-view.component';
import { SimulationCrudComponent } from 'app/pages/simulation/simulation-crud/simulation-crud.component';
import { FueltollsViewComponent } from 'app/pages/fueltolls/fueltolls-view/fueltolls-view.component';
import { FueltollsCrudComponent } from 'app/pages/fueltolls/fueltolls-crud/fueltolls-crud.component';
import { VehicletypeCrudComponent } from 'app/pages/vehicle/core/vehicletype-crud/vehicletype-crud.component';
import { VehicleclassificationCrudComponent } from 'app/pages/vehicle/core/vehicleclassification-crud/vehicleclassification-crud.component';
import {AccordionModule} from 'primeng/accordion';
import {CardModule} from 'primeng/card';
//import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CardModule,
    AccordionModule,
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
    CategoryCrudComponent,
    CategoryViewComponent,
    RoadwayNewComponent,
    RoadwayViewComponent,
    RoadwayUpdateComponent,
    VehicleclassificationCrudComponent,
    BodyworkCrudComponent,
    TransportViewComponent,
    ConfirmationDialogComponent,
    TransportCrudComponent,
    InitialsCrudComponent,
    LocationViewComponent,
    UnitymeasurementCrudComponent,
    CurrencyCrudComponent,
    SimulationViewComponent,
    SimulationCrudComponent,
    FueltollsViewComponent,
    FueltollsCrudComponent,
    VehicletypeCrudComponent
  ]
})

export class AdminLayoutModule {}
