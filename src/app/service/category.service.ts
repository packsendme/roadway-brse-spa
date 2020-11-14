import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CategoryModel } from 'app/model/category-model';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  url = environment.ip + environment.categoryPort + environment.appName + '/category';
  headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');
  category: CategoryModel[] = [];

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

  getCategory(): Observable<Response> {
    this.headersOnInit();
    const httpOptions = {headers: this.headers}
    return this.httpClient.get<Response>(this.url, httpOptions)
  }

  getCategoryByTransport(transport: String): Observable<Response> {
    this.headersOnInit();
    const urlCategory_Transp = this.url + '/transport/' + transport
    console.log(' URL ', urlCategory_Transp);
    const httpOptions = {headers: this.headers}
    return this.httpClient.get<Response>(urlCategory_Transp, httpOptions)
  }

  postCategory(category: CategoryModel): Observable<Response> {
    this.headersOnInit();
    //console.log('SERVICE MAPS ', category.categoryCosts.size);

    const httpOptions = {headers: this.headers}
    return this.httpClient.post<Response>(this.url, category, httpOptions)
  }

  putCategory(category: CategoryModel) {
    console.log(' putVehicle ', category.id);
    this.headersOnInit();
    const httpOptions = {headers: this.headers}
    return this.httpClient.put<Response>(this.url + '?id=' + category.id, category, httpOptions)
  };

  deleteCategory(category: CategoryModel) {
    this.headersOnInit();
    const httpOptions = {headers: this.headers}
    return this.httpClient.delete<Response>(this.url + '?id=' + category.id, httpOptions)
  }
}