import { RoadwaybreService } from './../../../service/roadwaybre.service';
import { DataTO } from './../../../model/dataTO';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { RoadwaybreModel } from 'app/model/roadwaybre-model';

@Component({
  selector: 'app-businessrule-view',
  templateUrl: './businessrule-view.component.html',
  styleUrls: ['./businessrule-view.component.css']
})
export class BusinessruleViewComponent implements OnInit {

  // List Another Requests
  roadwaysBRE: RoadwaybreModel[];

  roadwayBRE_Obj = {} as RoadwaybreModel;

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
    this.roadwayBREService.getRoadwayBRE().subscribe((roadwayData: Response) => {
      const roadwayDataStr = JSON.stringify(roadwayData.body);
      JSON.parse(roadwayDataStr, function (key, value) {
        if (key === 'roadways_bre') {
          roadwaysBRE_Vet = value;
          return value;
        } else {
           return value;
        }
      });
      this.roadwaysBRE = roadwaysBRE_Vet;
    });
  }

  selectRoadwayBRE(event: any, roadwaybreSelect: any) {
    this.roadwayBRE_Obj = roadwaybreSelect;
  }

    // --------- OPERATION TRANSACTION - CRUD ---------------------------------------//

    newRoadwayBRE() {
      this.router.navigate(['/businessrule-new']);
    }

    editRoadwayBRE() {
      this.roadwayDto.roadwayBREData = this.roadwayBRE_Obj;
      this.router.navigate(['/businessrule-update']);
    }




}
