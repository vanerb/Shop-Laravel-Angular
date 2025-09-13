import { Injectable } from '@angular/core';
import {Product} from '../interfaces/products';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {User} from '../interfaces/users';
import {AuthService} from './auth-service';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  baseUrl = 'http://localhost:8000/api/';

  constructor(private http: HttpClient, private readonly authService: AuthService) {
  }
  getAllUsers(){
    return this.http.get<User[]>(this.baseUrl + 'users/all');
  }



  update(id: number, user: FormData){
    user.append('_method', 'PATCH');
    return  this.http.post(this.baseUrl + 'users/updateProfile/'+id, user);
  }

  delete(id: number){
    return  this.http.delete(this.baseUrl + 'users/'+id);
  }


}
