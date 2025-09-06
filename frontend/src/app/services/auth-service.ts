import { Injectable } from '@angular/core';
import {Login, Token} from '../interfaces/auth';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Router} from '@angular/router';
import {CreateUser} from '../interfaces/users';

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

  /*getUserByToken(){
    let headers = new HttpHeaders().set('Authorization', `Bearer ${this.getToken()}`);
    return this.http.get<User>(this.base + '/user/token',  { headers })
  }*/

  login(login: Login) {
    this.http.post<Token>(this.base + '/login', login).subscribe({
      next: async (token: Token) => {
        this.setToken(token.access_token);
        await this.router.navigate(['/']);
        window.location.reload()

      },
      error: (err) => {

      }
    });


  }

  register(user: CreateUser) {
    this.http.post<Token>(this.base + '/register', user).subscribe({
      next: async (token: Token) => {
        await this.router.navigate(['/']);
        window.location.reload()
      },
      error: (err) => {

      }
    });
  }

  setToken(token: string) {
    localStorage.setItem('token', token);
  }

  logout() {
    localStorage.removeItem('token');
  }
}
