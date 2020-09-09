import { Injectable } from '@angular/core';
import { VehicleTypeModel } from 'app/model/vehicle-type-model';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VehicleTypeService {
  url_vehicleType = 'http://192.241.133.13:9008/roadway/manager/vehicletype';
  headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');
  vehicleType: VehicleTypeModel[] = [];

  constructor(private httpClient: HttpClient) { }

  headersOnInit() {
    this.headers = this.headers.append('Access-Control-Allow-Origin', '*');
    this.headers = this.headers.append('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    this.headers = this.headers.append('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    this.headers = this.headers.append('isoLanguageCode', 'pt');
    this.headers = this.headers.append('isoCountryCode', 'BR');
    this.headers = this.headers.append('isoCurrencyCode', 'BRL');
    this.headers = this.headers.append('originApp', 'APP-MICROSERVICE');
  }

  getVehicleType(): Observable<Response> {
    this.headersOnInit();
    const httpOptions = {headers: this.headers}
    return this.httpClient.get<Response>(this.url_vehicleType, httpOptions)
    }

  postVehicleType(vehicleType: VehicleTypeModel): Observable<Response> {
    this.headersOnInit();
    const httpOptions = {headers: this.headers}
    return this.httpClient.post<Response>(this.url_vehicleType, vehicleType, httpOptions)
  }

  putVehicleType(vehicleType: VehicleTypeModel){
    console.log(' bodyWork ', vehicleType.id);
    this.headersOnInit();
    const httpOptions = {headers: this.headers}
    return this.httpClient.put<Response>(this.url_vehicleType + '?id=' + vehicleType.id, vehicleType, httpOptions)
  };

  deleteVehicleType(vehicleType: VehicleTypeModel) {
    console.log(' deleteVehicle ', vehicleType.id);
    this.headersOnInit();
    const httpOptions = {headers: this.headers}
    return this.httpClient.delete<Response>(this.url_vehicleType + '?id=' + vehicleType.id, httpOptions)
  }

}
