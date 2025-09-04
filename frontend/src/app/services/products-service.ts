import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Product } from '../interfaces/products';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  baseUrl: string = 'http://localhost:8000/api/';

  constructor(private http: HttpClient) {
  }

  getAllProductsByUser() {
    let headers = new HttpHeaders().set('Authorization', `Bearer 1|628ue3F5Gxu0WntzgITjBElAPxjCkyUmTPPYacYic25b8ef6`);
    return  this.http.get<Product[]>(this.baseUrl + 'products', { headers });
  }
}
