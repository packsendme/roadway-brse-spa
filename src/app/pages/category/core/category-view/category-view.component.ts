import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CategoryService } from 'app/service/category.service';
import { ToastrService } from 'ngx-toastr';
import { CategoryModel } from 'app/model/category-model';
import { DataTO } from 'app/model/dataTO';

@Component({
  selector: 'app-categories',
  templateUrl: './category-view.component.html',
  styleUrls: ['./category-view.component.css']
})
export class CategoryViewComponent implements OnInit {

  // List Another Requests
  categories: CategoryModel[];

  // Screen Option
  categoryOne_Obj = {} as CategoryModel;
  statusNew_btn = true;
  statusEditNew_btn = true;

  constructor(
    private categoryService: CategoryService,
    private categoryData: DataTO,
    private toastr: ToastrService,
    private router: Router) { }

  ngOnInit(): void {
    this.findCategories();
  }

// --------- REQUESTs - EXTERNAL ---------------------------------------//

  findCategories() {
    let categoriesVet: CategoryModel [] = [];
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
      console.log('categories', this.categories);
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
    this.router.navigate(['/category-new']);
  }

  editCategory() {
    this.categoryData.categoryruleData = this.categoryOne_Obj;
    this.router.navigate(['/category-update']);
  }

}
