import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Category} from '../interfaces/categories';
import {AddProductBasket, Basket} from '../interfaces/basket';
import {CreateOrder, Order} from '../interfaces/order';
import {AuthService} from './auth-service';
import {API_BASE_URL} from './api-base-url';

@Injectable({
  providedIn: 'root'
})
export class BasketService {
  baseUrl = API_BASE_URL;

  constructor(private http: HttpClient, private readonly authService: AuthService) {
  }

  getAllBasketByUser(){
    let headers = new HttpHeaders().set('Authorization', `Bearer ${this.authService.getToken()}`);
    return  this.http.get<Basket>(this.baseUrl + 'basket', { headers });
  }

  getBasketById(id: number){
    let headers = new HttpHeaders().set('Authorization', `Bearer ${this.authService.getToken()}`);
    return  this.http.get<Basket>(this.baseUrl + 'basket/'+id, { headers });
  }

  getAllOrder(){
    let headers = new HttpHeaders().set('Authorization', `Bearer ${this.authService.getToken()}`);
    return  this.http.get<Order[]>(this.baseUrl + 'payments/all', { headers });
  }


  getAllOrderByUser(){
    let headers = new HttpHeaders().set('Authorization', `Bearer ${this.authService.getToken()}`);
    return  this.http.get<Order[]>(this.baseUrl + 'payments', { headers });
  }

  updateOrderStatus(id: number, status: string) {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.authService.getToken()}`);
    return this.http.patch(this.baseUrl + 'payments/' + id, { status }, { headers });
  }

  deleteOrder(id: number) {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.authService.getToken()}`);
    return this.http.delete(this.baseUrl + 'payments/' + id, { headers });
  }


  createOrder(order: CreateOrder){
    let headers = new HttpHeaders().set('Authorization', `Bearer ${this.authService.getToken()}`);
    return  this.http.post(this.baseUrl + 'payments', order, { headers });
  }


  addProductBasket(add: AddProductBasket){
    let headers = new HttpHeaders().set('Authorization', `Bearer ${this.authService.getToken()}`);
    return  this.http.post(this.baseUrl + 'basket/add', add, { headers });
  }

  removeProductBasket(id: number){
    let headers = new HttpHeaders().set('Authorization', `Bearer ${this.authService.getToken()}`);
    return  this.http.delete(this.baseUrl + 'basket/remove/'+id, { headers });
  }
}

