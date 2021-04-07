import { CostsRoadwayModel } from "./costs-roadway-model";
import { SimulationRequestModel } from "./simulation-request-model";

export interface SimulationResponseModel {

  distance_total: number;
	duration: number
	toll_total: number
  requestData: SimulationRequestModel;
	responseData: CostsRoadwayModel[];
	dt_simulation: Date;
}
