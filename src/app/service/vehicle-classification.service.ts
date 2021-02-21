import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment';
import { VehicleClassificationModel } from 'app/model/vehicle-classification-model';

@Injectable({
  providedIn: 'root'
})
export class VehicleClassificationService {
  url = environment.ip + environment.vehiclePort + environment.appName + '/vehicle/classification';
  headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');
  vehicleClassification: VehicleClassificationModel[] = [];

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

  get(): Observable<Response> {
    this.headersOnInit();
    const httpOptions = {headers: this.headers}
    return this.httpClient.get<Response>(this.url, httpOptions)
    }

    getVehicleTypeByType(parameter: string): Observable<Response> {
      this.headersOnInit();
      const urlType = this.url + '/type/' + parameter;
      const httpOptions = {headers: this.headers}
      return this.httpClient.get<Response>(urlType, httpOptions)
      }

  post(vehicleType: VehicleClassificationModel): Observable<Response> {
    this.headersOnInit();
    const httpOptions = {headers: this.headers}
    return this.httpClient.post<Response>(this.url, vehicleType, httpOptions)
  }

  put(vehicleType: VehicleClassificationModel){
    console.log(' bodyWork ', vehicleType.id);
    this.headersOnInit();
    const httpOptions = {headers: this.headers}
    return this.httpClient.put<Response>(this.url + '?id=' + vehicleType.id, vehicleType, httpOptions)
  };

  delete(vehicleType: VehicleClassificationModel) {
    console.log(' deleteVehicle ', vehicleType.id);
    this.headersOnInit();
    const httpOptions = {headers: this.headers}
    return this.httpClient.delete<Response>(this.url + '?id=' + vehicleType.id, httpOptions)
  }

}
