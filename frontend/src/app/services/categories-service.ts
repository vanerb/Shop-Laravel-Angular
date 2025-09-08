import { Injectable } from '@angular/core';
import {Category} from '../interfaces/categories';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {AuthService} from './auth-service';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {
  baseUrl: string = 'http://localhost:8000/api/';

  constructor(private http: HttpClient, private readonly authService: AuthService) {
  }

  getAllCategoriesByUser(){
    let headers = new HttpHeaders().set('Authorization', `Bearer ${this.authService.getToken()}`);
    return  this.http.get<Category[]>(this.baseUrl + 'categories', { headers });
  }

  create(category: FormData){
    let headers = new HttpHeaders().set('Authorization', `Bearer ${this.authService.getToken()}`);
    return  this.http.post(this.baseUrl + 'categories', category, { headers });
  }

  update(id: number,category: FormData){
    category.append('_method', 'PATCH');
    let headers = new HttpHeaders().set('Authorization', `Bearer ${this.authService.getToken()}`);
    return  this.http.post(this.baseUrl + 'categories/'+id, category, { headers });
  }

  delete(id: number){
    let headers = new HttpHeaders().set('Authorization', `Bearer ${this.authService.getToken()}`);
    return  this.http.delete(this.baseUrl + 'categories/'+id, { headers });
  }
}
