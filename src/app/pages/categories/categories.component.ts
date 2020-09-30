import { CategoryTypeService } from 'app/service/category-type.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CategoryRuleModel } from 'app/model/category-rule-model';
import { CategoryData } from 'app/model/categoryData';
import { CategoryService } from 'app/service/category.service';
import { ToastrService } from 'ngx-toastr';
import { CategoryTypeModel } from 'app/model/category-type-model';
import { VehicleModel } from 'app/model/vehicle-model';
import { LocationModel } from 'app/model/location-model';
import { LocationService } from 'app/service/location.service';
import { VehicleService } from 'app/service/vehicle.service';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {

  // List Another Requests
  categories: CategoryRuleModel[];
  isSearch = true;

  // Screen Option
  categoryOne_Obj = {} as CategoryRuleModel;
  statusNew_btn = true;
  statusEditNew_btn = true;

  constructor(
    private categoryTypeService: CategoryTypeService,
    private categoryData: CategoryData,
    private categoryService: CategoryService,
    private toastr: ToastrService,
    private router: Router,
    private locationService: LocationService,
    private vehicleService: VehicleService) { }

  ngOnInit(): void {
    this.findCategories();
  }

//--------- REQUESTs - EXTERNAL ---------------------------------------//

  findCategories() {
    let categoriesVet: CategoryRuleModel [] = [];
    this.categoryService.getCategory().subscribe((categoryData: Response) => {
      const categoryDataStr = JSON.stringify(categoryData.body);
      JSON.parse(categoryDataStr, function (key, value) {
        if (key === 'categories') {
          categoriesVet = value;
          return value;
        } else {
           return value;
        }
      });
      this.categories = categoriesVet;
    });
  }


  selectCategory(event: any, categorySelect: any) {
    this.statusNew_btn = false;
    this.statusEditNew_btn = false;
    this.categoryOne_Obj = categorySelect;
  }


   // --------- OPERATION TRANSACTION - CRUD ---------------------------------------//

   newCategory() {
    this.router.navigate(['/category']);
  }

  editCategory() {
    this.isSearch = false;
    console.log(' CATEGORY NAME - EDIT ', this.categoryOne_Obj.categoryType.name_category);
    this.categoryData.categoryruleData = this.categoryOne_Obj;
    this.router.navigate(['/categoryupdate']);
  }

}
