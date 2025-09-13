import { Injectable } from '@angular/core';
import {Login, Token} from '../interfaces/auth';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Router} from '@angular/router';
import {CreateUser, User} from '../interfaces/users';
import {Category} from '../interfaces/categories';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  base = 'http://127.0.0.1:8000/api'


  constructor(private http: HttpClient, private readonly router: Router) {
  }

  isLoggedIn(): boolean {
    if (typeof localStorage === 'undefined') {
      return false; // no hay localStorage, asumimos no logueado
    }
    return !!localStorage.getItem('token');
  }

  getToken() {
    if (typeof localStorage === 'undefined') {
      return false; // no hay localStorage, asumimos no logueado
    }
    return localStorage.getItem('token');
  }


  setType(type: string){
    localStorage.setItem('type', type);
  }

  deleteType(){
    localStorage.removeItem('type');
  }

  getType(){

    if (typeof localStorage === 'undefined') {
      return false; // no hay localStorage, asumimos no logueado
    }
    return localStorage.getItem('type');
  }

  getUserByToken(){
    let headers = new HttpHeaders().set('Authorization', `Bearer ${this.getToken()}`);
    return this.http.get<User>(this.base + '/user',  { headers })
  }

  login(login: Login) {
    this.http.post<Token>(this.base + '/login', login).subscribe({
      next: async (token: Token) => {
        this.setToken(token.access_token);
        this.setType(token.type)
        await this.router.navigate(['/']);
        window.location.reload()

      },
      error: (err) => {

      }
    });

  }

  register(user: FormData) {
    return this.http.post<Token>(this.base + '/register', user)
  }

  setToken(token: string) {
    localStorage.setItem('token', token);
  }

  logout() {
    localStorage.removeItem('token');
    this.deleteType()
  }
}
