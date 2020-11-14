import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RoadwaybreModel } from 'app/model/roadwaybre-model';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RoadwaybreService {
  url = environment.ip + environment.roadwayPort + environment.appName + '/roadway';
  headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');
  roadway: RoadwaybreModel[] = [];

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

  getRoadwayBRE(): Observable<Response> {
    this.headersOnInit();
    const httpOptions = {headers: this.headers}
    return this.httpClient.get<Response>(this.url, httpOptions)
    }

  postRoadwayBRE(roadway: RoadwaybreModel): Observable<Response> {
    this.headersOnInit();
    const httpOptions = {headers: this.headers}
    return this.httpClient.post<Response>(this.url, roadway, httpOptions)
  }

  putRoadwayBRE(roadway: RoadwaybreModel) {
    console.log(' putVehicle ', roadway.id);
    this.headersOnInit();
    const httpOptions = {headers: this.headers}
    return this.httpClient.put<Response>(this.url + '?id=' + roadway.id, roadway, httpOptions)
  };

  deleteRoadwayBRE(roadway: RoadwaybreModel) {
    this.headersOnInit();
    const httpOptions = {headers: this.headers}
    return this.httpClient.delete<Response>(this.url + '?id=' + roadway.id, httpOptions)
  }
}
