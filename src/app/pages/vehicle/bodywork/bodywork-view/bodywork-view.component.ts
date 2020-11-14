import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BodyworkModel } from 'app/model/bodywork-model';
import { DataTO } from 'app/model/dataTO';
import { BodyworkService } from 'app/service/bodywork.service';

@Component({
  selector: 'app-bodywork-view',
  templateUrl: './bodywork-view.component.html',
  styleUrls: ['./bodywork-view.component.css']
})
export class BodyworkViewComponent implements OnInit {

  // List Another Requests
  bodyworkes: BodyworkModel[];

  bodyworkOne_Obj = {} as BodyworkModel;
  statusNew_btn = true;
  statusEditNew_btn = true;

  constructor(
    private bodyworkService: BodyworkService,
    private bodyworkTO: DataTO,
    private router: Router) { }

  ngOnInit(): void {
    this.findBodyworks();
  }


  //--------- REQUESTs - INTERNAL ---------------------------------------//

  findBodyworks() {
    let bodyworksVet: BodyworkModel[] = [];
    this.bodyworkService.getBodyWork().subscribe((bodyworksData: Response) =>{
      const bodyworksStr = JSON.stringify(bodyworksData.body);
      JSON.parse(bodyworksStr, function (key, value) {
        if (key === 'bodies') {
          bodyworksVet = value;
          return value;
        } else {
          return value;
        }
      });
      this.bodyworkes = bodyworksVet;
    });
  }



  selectLocation(event: any, bodyworkselect: any) {
    this.statusNew_btn = false;
    this.bodyworkOne_Obj = bodyworkselect;
  }


   // --------- OPERATION TRANSACTION - CRUD ---------------------------------------//

   new() {
    this.bodyworkTO.bodyworkData = null;
    this.router.navigate(['/bodywork-crud']);
  }

  edit() {
    this.bodyworkTO.bodyworkData = this.bodyworkOne_Obj;
    this.router.navigate(['/bodywork-crud']);
  }



}
