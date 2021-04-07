import { SimulationResponseModel } from './../model/simulation-response-model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SimulationRequestModel } from 'app/model/simulation-request-model';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SimulationService  {
  url = environment.ip + environment.simulationPort + '/roadway/simulation';
  headers = new HttpHeaders();

  constructor(private httpClient: HttpClient) { this.headersOnInit();}

  headersOnInit() {
    console.log(' headersOnInit OK ');
    this.headers = null
    this.headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');
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

  postSimulation(simulationRequest: SimulationRequestModel): Observable<Response> {
    this.headersOnInit();
    let httpOptions = {headers: this.headers}
    console.log('headersOnInit = ', httpOptions);
    return this.httpClient.post<Response>(this.url, simulationRequest, httpOptions);
  }

  postSaveSimulation(simulationResponseModel: SimulationResponseModel): Observable<Response> {
    this.headersOnInit();
    let httpOptions = {headers: this.headers}
    console.log('headersOnInit = ', httpOptions);
    return this.httpClient.post<Response>(this.url, simulationResponseModel, httpOptions);
  }
}
