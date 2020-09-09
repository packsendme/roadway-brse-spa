import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { BodyWorkModel } from 'app/model/body-work-model';

@Injectable({
  providedIn: 'root'
})
export class BodyWorkService {
  url_bodywork = 'http://192.241.133.13:9008/roadway/manager/bodywork';
  headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');
  bodyWork: BodyWorkModel[] = [];

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

  getBodyWork(): Observable<Response> {
    this.headersOnInit();
    const httpOptions = {headers: this.headers}
    return this.httpClient.get<Response>(this.url_bodywork, httpOptions)
    }

  postBodyWork(bodyWork: BodyWorkModel): Observable<Response> {
    this.headersOnInit();
    const httpOptions = {headers: this.headers}
    return this.httpClient.post<Response>(this.url_bodywork, bodyWork, httpOptions)
  }

  putBodyWork(bodyWork: BodyWorkModel){
    console.log(' bodyWork ', bodyWork.id);
    this.headersOnInit();
    const httpOptions = {headers: this.headers}
    return this.httpClient.put<Response>(this.url_bodywork + '?id=' + bodyWork.id, bodyWork, httpOptions)
  };

  deleteBodyWork(bodyWork: BodyWorkModel) {
    console.log(' deleteVehicle ', bodyWork.id);
    this.headersOnInit();
    const httpOptions = {headers: this.headers}
    return this.httpClient.delete<Response>(this.url_bodywork + '?id=' + bodyWork.id, httpOptions)
  }




}
