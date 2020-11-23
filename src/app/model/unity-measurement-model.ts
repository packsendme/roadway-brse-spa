export interface UnityMeasurementModel {
  id: String;
  unityType: String;
  unityArea: String[];
  unityVolume: String[];
  unityWeight: Map<string, string>;
  unityTemperature: String[];
  unityCurrency: String[];
}
