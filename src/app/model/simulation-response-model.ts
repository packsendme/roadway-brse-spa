import { CostsRoadwayModel } from "./costs-roadway-model";
import { SimulationRequestModel } from "./simulation-request-model";

export interface SimulationResponseModel {
  requestData: SimulationRequestModel;
	responseData: CostsRoadwayModel[];
	dt_simulation: Date;
}
