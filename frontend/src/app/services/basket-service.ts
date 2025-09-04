import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Category} from '../interfaces/categories';
import {Basket} from '../interfaces/basket';
import {CreateOrder, Order} from '../interfaces/order';

@Injectable({
  providedIn: 'root'
})
export class BasketService {
  baseUrl: string = 'http://localhost:8000/api/';

  constructor(private http: HttpClient) {
  }

  getAllBasketByUser(){
    let headers = new HttpHeaders().set('Authorization', `Bearer 1|628ue3F5Gxu0WntzgITjBElAPxjCkyUmTPPYacYic25b8ef6`);
    return  this.http.get<Basket>(this.baseUrl + 'basket', { headers });
  }


  getAllOrderByUser(){
    let headers = new HttpHeaders().set('Authorization', `Bearer 1|628ue3F5Gxu0WntzgITjBElAPxjCkyUmTPPYacYic25b8ef6`);
    return  this.http.get<Order[]>(this.baseUrl + 'payments', { headers });
  }

  createOrder(order: CreateOrder){
    let headers = new HttpHeaders().set('Authorization', `Bearer 1|628ue3F5Gxu0WntzgITjBElAPxjCkyUmTPPYacYic25b8ef6`);
    return  this.http.post(this.baseUrl + 'payments', order, { headers });
  }
}
