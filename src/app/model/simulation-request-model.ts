export interface SimulationRequestModel {
  address_origin: string;
  address_destination: string;
  type_transport: string;
  product_transport: string;
  people: number;
  weight_max: number;
  unity_weight: {};
  height_max: number;
  width_max: number;
  length_max: number;
  delivery_type: string;
}
