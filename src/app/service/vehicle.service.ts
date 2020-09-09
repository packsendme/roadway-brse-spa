import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { VehicleModel } from 'app/model/vehicle-model';

@Injectable({
  providedIn: 'root'
})
export class VehicleService {
  url_vehicle = 'http://192.241.133.13:9008/roadway/manager/vehicle';
  headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');
  vehicle: VehicleModel[] = [];

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

  getVehicle(): Observable<Response>{
    this.headersOnInit();
    const httpOptions = {headers: this.headers}
    return this.httpClient.get<Response>(this.url_vehicle, httpOptions)
    }

  postVehicle(vehicle: VehicleModel): Observable<Response> {
    this.headersOnInit();
    const httpOptions = {headers: this.headers}
    return this.httpClient.post<Response>(this.url_vehicle, vehicle, httpOptions)
  }

  putVehicle(vehicle: VehicleModel){
    console.log(' putVehicle ', vehicle.id);
    this.headersOnInit();
    const httpOptions = {headers: this.headers}
    return this.httpClient.put<Response>(this.url_vehicle + '?id=' + vehicle.id, vehicle, httpOptions)
  };

  deleteVehicle(vehicle: VehicleModel){
    console.log(' deleteVehicle ', vehicle.id);
    this.headersOnInit();
    const httpOptions = {headers: this.headers}
    return this.httpClient.delete<Response>(this.url_vehicle + '?id=' + vehicle.id, httpOptions)
  }
}
