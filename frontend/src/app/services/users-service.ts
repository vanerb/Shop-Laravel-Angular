import { Injectable } from '@angular/core';
import {Product} from '../interfaces/products';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {User} from '../interfaces/users';
import {AuthService} from './auth-service';
import {API_BASE_URL} from './api-base-url';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  baseUrl = API_BASE_URL;

  constructor(private http: HttpClient, private readonly authService: AuthService) {
  }

  private get headers() {
    return new HttpHeaders().set('Authorization', `Bearer ${this.authService.getToken()}`);
  }

  getAllUsers(){
    return this.http.get<User[]>(this.baseUrl + 'users/all', {headers: this.headers});
  }

  create(user: FormData) {
    return this.http.post<User>(this.baseUrl + 'users', user, {headers: this.headers});
  }



  update(id: number, user: FormData){
    user.append('_method', 'PATCH');
    return this.http.post(this.baseUrl + 'users/updateProfile/'+id, user, {headers: this.headers});
  }

  delete(id: number){
    return this.http.delete(this.baseUrl + 'users/'+id, {headers: this.headers});
  }


}

