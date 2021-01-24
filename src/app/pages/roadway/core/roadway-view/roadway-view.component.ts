import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { RoadwaybreModel } from 'app/model/roadwaybre-model';
import { DataTO } from 'app/model/dataTO';
import { RoadwaybreService } from 'app/service/roadwaybre.service';

@Component({
  selector: 'roadway-view',
  templateUrl: './roadway-view.component.html',
  styleUrls: ['./roadway-view.component.css']
})
export class RoadwayViewComponent implements OnInit {

  // List Another Requests
  roadwaysBRE: RoadwaybreModel[];

  roadwayBRE_Obj = {} as RoadwaybreModel;
  isEdit = true;

  constructor(
    private roadwayDto: DataTO,
    private roadwayBREService: RoadwaybreService,
    private toastr: ToastrService,
    private router: Router) { }

  ngOnInit(): void {
    this.findRoadway();
  }

  // --------- REQUESTs - EXTERNAL ---------------------------------------//

  findRoadway() {
    let roadwaysBRE_Vet: RoadwaybreModel [] = [];
    this.roadwayBREService.get().subscribe((roadwayData: Response) => {
      const roadwayDataStr = JSON.stringify(roadwayData.body);
      JSON.parse(roadwayDataStr, function (key, value) {
        if (key === 'roadways') {
          roadwaysBRE_Vet = value;
          return value;
        } else {
           return value;
        }
      });
      this.roadwaysBRE = roadwaysBRE_Vet;
      console.log('123456', this.roadwaysBRE);
    });
  }

  selectRoadwayBRE(event: any, roadwaybreSelect: any) {
    this.roadwayBRE_Obj = roadwaybreSelect;
    this.isEdit = false;
  }

    // --------- OPERATION TRANSACTION - CRUD ---------------------------------------//

    newRoadwayBRE() {
      this.router.navigate(['/roadway-new']);
    }

    editRoadwayBRE() {
      this.roadwayDto.roadwayBREData = this.roadwayBRE_Obj;
      this.router.navigate(['/roadway-update']);
    }




}
