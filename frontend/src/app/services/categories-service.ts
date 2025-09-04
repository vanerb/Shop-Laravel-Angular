import { Injectable } from '@angular/core';
import {Category} from '../interfaces/categories';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {
  baseUrl: string = 'http://localhost:8000/api/';

  constructor(private http: HttpClient) {
  }

  getAllCategoriesByUser(){
    let headers = new HttpHeaders().set('Authorization', `Bearer 1|628ue3F5Gxu0WntzgITjBElAPxjCkyUmTPPYacYic25b8ef6`);
    return  this.http.get<Category[]>(this.baseUrl + 'categories', { headers });
  }
}
