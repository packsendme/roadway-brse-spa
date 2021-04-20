import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TransportTypeModel } from 'app/model/transport-type-model';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TransportTypeService {
  url = environment.ip + environment.transportPort + environment.appName + '/transport';
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

  get(): Observable<Response> {
    this.headersOnInit();
    const httpOptions = {headers: this.headers}
    console.log('GET', this.url);
    return this.httpClient.get<Response>(this.url, httpOptions)
    }

    getTransportByName(name: String): Observable<Response> {
      const url_parameters = this.url + '/type/' + name;
      this.headersOnInit();
      const httpOptions = {headers: this.headers}
      console.log('GET', url_parameters);
      return this.httpClient.get<Response>(url_parameters, httpOptions)
    }

  post(transportType: TransportTypeModel): Observable<Response> {
    console.log('TRANSPORT', transportType);
    this.headersOnInit();
    const httpOptions = {headers: this.headers}
    return this.httpClient.post<Response>(this.url, transportType, httpOptions)
  }

  put(transportType: TransportTypeModel){
    this.headersOnInit();
    const httpOptions = {headers: this.headers}
    return this.httpClient.put<Response>(this.url + '?id=' + transportType.id, transportType, httpOptions)
  };

  delete(transportType: TransportTypeModel) {
    console.log(' deleteTransport ', transportType.id);
    this.headersOnInit();
    const httpOptions = {headers: this.headers}
    return this.httpClient.delete<Response>(this.url + '?id=' + transportType.id, httpOptions)
  }

}
