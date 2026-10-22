import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Product } from '../interfaces/products';
import {AuthService} from './auth-service';
import {API_BASE_URL} from './api-base-url';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  baseUrl = API_BASE_URL;

  constructor(private http: HttpClient, private readonly authService: AuthService) {
  }

  getAllProductsByUser() {
    let headers = new HttpHeaders().set('Authorization', `Bearer ${this.authService.getToken()}`);
    return  this.http.get<Product[]>(this.baseUrl + 'productsByUser', { headers });
  }

  getAllProducts() {
    return  this.http.get<Product[]>(this.baseUrl + 'products');
  }

  create(product: FormData){
    let headers = new HttpHeaders().set('Authorization', `Bearer ${this.authService.getToken()}`);
    return  this.http.post(this.baseUrl + 'products', product, { headers });
  }

  delete(id: number){
    let headers = new HttpHeaders().set('Authorization', `Bearer ${this.authService.getToken()}`);
    return  this.http.delete(this.baseUrl + 'products/'+id, { headers });
  }

  update(id: number, product: FormData){
    product.append('_method', 'PATCH');
    let headers = new HttpHeaders().set('Authorization', `Bearer ${this.authService.getToken()}`);
    return  this.http.post(this.baseUrl + 'products/'+id, product, { headers });
  }
}
