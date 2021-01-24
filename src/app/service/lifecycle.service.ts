import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LifecycleService {

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


  putPublished(id: String, transport: String) {
    let url = environment.ip + environment.roadwayPort + environment.appName + '/roadway/published';
    url = url + '?id=' + id + '&transport=' + transport
    console.log(' URL - putPublished', url);

    this.headersOnInit();
    const httpOptions = {headers: this.headers}
    return this.httpClient.put<Response>(url, null, httpOptions)
  };

  putBlocked(id: String) {
    let url = environment.ip + environment.roadwayPort + environment.appName + '/roadway/blocked';
    url = url + '?id=' + id;
    this.headersOnInit();
    const httpOptions = {headers: this.headers}
    return this.httpClient.put<Response>(url, null, httpOptions)
  };

  putUnlocked(id: String) {
    let url = environment.ip + environment.roadwayPort + environment.appName + '/roadway/unlocked';
    url = url + '?id=' + id;
    this.headersOnInit();
    const httpOptions = {headers: this.headers}
    return this.httpClient.put<Response>(url, null, httpOptions)
  };

  putCanceled(id: String) {
    let url = environment.ip + environment.roadwayPort + environment.appName + '/roadway/canceled';
    url = url + '?id=' + id;
    this.headersOnInit();
    const httpOptions = {headers: this.headers}
    return this.httpClient.put<Response>(url, null, httpOptions)
  };

}

