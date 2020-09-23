import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CategoryModel } from 'app/model/category-model';
import { Observable } from 'rxjs';
import { TransportTypeModel } from 'app/model/transport-type-model';

@Injectable({
  providedIn: 'root'
})
export class TransportTypeService {
  url_transportType = 'http://192.241.133.13:9008/roadway/manager/transport';
  headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');
  transportType: TransportTypeModel[] = [];

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

  getTransportType(): Observable<Response> {
    this.headersOnInit();
    const httpOptions = {headers: this.headers}
    return this.httpClient.get<Response>(this.url_transportType, httpOptions)
    }

  postTransportType(transportType: TransportTypeModel): Observable<Response> {
    this.headersOnInit();
    const httpOptions = {headers: this.headers}
    return this.httpClient.post<Response>(this.url_transportType, transportType, httpOptions)
  }

  putTransportType(transportType: TransportTypeModel){
    this.headersOnInit();
    const httpOptions = {headers: this.headers}
    return this.httpClient.put<Response>(this.url_transportType + '?id=' + transportType.id, transportType, httpOptions)
  };

  deleteTransportType(transportType: TransportTypeModel) {
    console.log(' deleteTransport ', transportType.id);
    this.headersOnInit();
    const httpOptions = {headers: this.headers}
    return this.httpClient.delete<Response>(this.url_transportType + '?id=' + transportType.id, httpOptions)
  }

}
