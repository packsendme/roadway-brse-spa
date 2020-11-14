import { Injectable } from '@angular/core';
import { VehicleTypeModel } from 'app/model/vehicle-type-model';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VehicleTypeService {
  url = environment.ip + environment.vehiclePort + environment.appName + '/vehicle/vehicletype';
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
    return this.httpClient.get<Response>(this.url, httpOptions)
    }

  postVehicleType(vehicleType: VehicleTypeModel): Observable<Response> {
    this.headersOnInit();
    const httpOptions = {headers: this.headers}
    return this.httpClient.post<Response>(this.url, vehicleType, httpOptions)
  }

  putVehicleType(vehicleType: VehicleTypeModel){
    console.log(' bodyWork ', vehicleType.id);
    this.headersOnInit();
    const httpOptions = {headers: this.headers}
    return this.httpClient.put<Response>(this.url + '?id=' + vehicleType.id, vehicleType, httpOptions)
  };

  deleteVehicleType(vehicleType: VehicleTypeModel) {
    console.log(' deleteVehicle ', vehicleType.id);
    this.headersOnInit();
    const httpOptions = {headers: this.headers}
    return this.httpClient.delete<Response>(this.url + '?id=' + vehicleType.id, httpOptions)
  }

}
