import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Product } from '../interfaces/products';
import {AuthService} from './auth-service';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  baseUrl: string = 'http://localhost:8000/api/';

  constructor(private http: HttpClient, private readonly authService: AuthService) {
  }

  getAllProductsByUser() {
    console.log("TOKEN", this.authService.getToken())
    let headers = new HttpHeaders().set('Authorization', `Bearer ${this.authService.getToken()}`);
    return  this.http.get<Product[]>(this.baseUrl + 'productsByUser', { headers });
  }

  getAllProducts() {
    return  this.http.get<Product[]>(this.baseUrl + 'products');
  }
}
