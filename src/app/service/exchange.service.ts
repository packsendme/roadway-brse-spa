import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ExchangeService {
  url = environment.ip + environment.exchangePort + environment.apiName + '/exchange';
  headers = new HttpHeaders();
  constructor(private httpClient: HttpClient) { }

  headersOnInit() {
    this.headers = null;
    this.headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');
    this.headers = this.headers.append('Access-Control-Allow-Origin', '*');
    this.headers = this.headers.append('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    this.headers = this.headers.append('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    this.headers = this.headers.append('isoLanguageCode', 'pt');
    this.headers = this.headers.append('isoCountryCode', 'BR');
    this.headers = this.headers.append('isoCurrencyCode', 'BRL');
    this.headers = this.headers.append('originApp', 'APP-MICROSERVICE');
  }

  getExchange(current: String): Observable<Response> {
    this.headersOnInit();
    const url_parameters = this.url + '/rate/' + current;
    const httpOptions = {headers: this.headers}
    console.log(' Exchange URL ', url_parameters);
    return this.httpClient.get<Response>(url_parameters, httpOptions)
  }


}
