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
import { LocationComponent } from 'app/pages/location/location.component';
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
import { CategoriesComponent } from 'app/pages/category/categories/categories.component';
import { CategoryupdateComponent } from 'app/pages/category/categoryupdate/categoryupdate.component';
import { CategorynewComponent } from 'app/pages/category/categorynew/categorynew.component';
import { BusinessruleNewComponent } from 'app/pages/bre/businessrule-new/businessrule-new.component';
import { BusinessruleViewComponent } from 'app/pages/bre/businessrule-view/businessrule-view.component';
import { BusinessruleUpdateComponent } from 'app/pages/bre/businessrule-update/businessrule-update.component';
import { VehicleCrudComponent } from 'app/pages/vehicle/core/vehicle-crud/vehicle-crud.component';
import { TransportComponent } from 'app/pages/transport/transport.component';
import { ConfirmationDialogComponent } from 'app/pages/confirmation-dialog/confirmation-dialog.component';
import { BodyworkViewComponent } from 'app/pages/vehicle/bodywork/bodywork-view/bodywork-view.component';
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
    LocationComponent,
    VehicleCrudComponent,
    VehicleViewComponent,
    CategorynewComponent,
    CategoriesComponent,
    CategoryupdateComponent,
    BusinessruleNewComponent,
    BusinessruleViewComponent,
    BusinessruleUpdateComponent,
    VehicletypeCrudComponent,
    BodyworkCrudComponent,
    BodyworkViewComponent,
    TransportComponent,
    ConfirmationDialogComponent
  ]
})

export class AdminLayoutModule {}
