import { TollsFuelModel } from './../model/tolls-fuel-model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TollsfuelService {
  url = environment.ip + environment.roadwayPort + environment.appName + '/roadway/tollsfuel';
  headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');

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

  get(country: string): Observable<Response> {
    const url_parameters = this.url + '?country=' + country;
    this.headersOnInit();
    const httpOptions = {headers: this.headers}
    return this.httpClient.get<Response>(url_parameters, httpOptions)
    }

  post(tollsfuel: TollsFuelModel): Observable<Response> {
    this.headersOnInit();
    console.log('POST FUEL', this.url);
    console.log('POST FUEL', tollsfuel);

    const httpOptions = {headers: this.headers}
    return this.httpClient.post<Response>(this.url, tollsfuel, httpOptions)
  }

  put(id: string, tollsfuel: TollsFuelModel) {
    const url_parameters = this.url + '?id=' + id;
    this.headersOnInit();
    const httpOptions = {headers: this.headers}
    return this.httpClient.put<Response>(url_parameters, tollsfuel, httpOptions)
  };

  delete(id: string) {
    const url_parameters = this.url + '?id=' + id;
    this.headersOnInit();
    const httpOptions = {headers: this.headers}
    return this.httpClient.delete<Response>(url_parameters, httpOptions)
  }
}
