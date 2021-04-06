export interface SimulationRequestModel {
  address_origin: string;
  address_destination: string;
  type_transport: string;
  product_transport: string;
  people: number;
  weight_max: number;
  unity_weight: string;
  height_max: string;
  width_max: number;
  length_max: string;
  delivery_type: string;
}
