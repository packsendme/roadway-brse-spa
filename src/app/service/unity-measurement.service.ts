import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { UnityMeasurementModel } from 'app/model/unity-measurement-model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UnityMeasurementService {
  url_unitymeasurement = 'http://192.241.133.13:9008/roadway/admin/unitymeasurement?country=BR';
  headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');
  unityMeasurement: UnityMeasurementModel[] = [];

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

  getUnityMeasurement(): Observable<Response> {
    this.headersOnInit();
    const httpOptions = {headers: this.headers}
    return this.httpClient.get<Response>(this.url_unitymeasurement, httpOptions)
    }

  postUnityMeasurement(unityMeasurement: UnityMeasurementModel): Observable<Response> {
    this.headersOnInit();
    const httpOptions = {headers: this.headers}
    return this.httpClient.post<Response>(this.url_unitymeasurement, unityMeasurement, httpOptions)
  }

  putUnityMeasurement(unityMeasurement: UnityMeasurementModel){
    console.log(' bodyWork ', unityMeasurement.id);
    this.headersOnInit();
    const httpOptions = {headers: this.headers}
    return this.httpClient.put<Response>(this.url_unitymeasurement + '?id=' + unityMeasurement.id, unityMeasurement, httpOptions)
  };

  deleteUnityMeasurement(unityMeasurement: UnityMeasurementModel) {
    console.log(' deleteVehicle ', unityMeasurement.id);
    this.headersOnInit();
    const httpOptions = {headers: this.headers}
    return this.httpClient.delete<Response>(this.url_unitymeasurement + '?id=' + unityMeasurement.id, httpOptions)
  }

}
