import { CategoryTypeModel } from './../model/category-type-model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CategoryRuleModel } from 'app/model/category-rule-model';

@Injectable({
  providedIn: 'root'
})
export class CategoryTypeService {
  url_categorytype = 'http://192.241.133.13:9008/roadway/manager/categorytype';
  headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');
  category: CategoryRuleModel[] = [];

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

  getCategoryType(): Observable<Response>{
    this.headersOnInit();
    const httpOptions = {headers: this.headers}
    return this.httpClient.get<Response>(this.url_categorytype, httpOptions)
    }

  postCategoryType(categoryType: CategoryTypeModel): Observable<Response> {
    this.headersOnInit();
    const httpOptions = {headers: this.headers}
    return this.httpClient.post<Response>(this.url_categorytype, categoryType, httpOptions)
  }

  putCategoryType(categoryType: CategoryTypeModel) {
    this.headersOnInit();
    const httpOptions = {headers: this.headers}
    return this.httpClient.put<Response>(this.url_categorytype + '?id=' + categoryType.id, categoryType, httpOptions)
  };

  deleteCategoryType(categoryType: CategoryTypeModel) {
    this.headersOnInit();
    const httpOptions = {headers: this.headers}
    return this.httpClient.delete<Response>(this.url_categorytype + '?id=' + categoryType.id, httpOptions)
  }
}
