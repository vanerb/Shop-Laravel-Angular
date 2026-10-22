import { Injectable, signal } from '@angular/core';
import {ChangePassword, Login, Token} from '../interfaces/auth';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Router} from '@angular/router';
import {API_BASE_URL} from './api-base-url';
import {User} from '../interfaces/users';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  base = API_BASE_URL.replace(/\/$/, '')
  readonly loginError = signal('');


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
    this.loginError.set('');
    this.http.post<Token>(this.base + '/login', login).subscribe({
      next: async (token: Token) => {
        this.setToken(token.access_token);
        this.setType(token.type)
        await this.router.navigate(['/shop']);

      },
      error: (err) => {
        this.loginError.set(err?.error?.errors?.email?.[0] ?? err?.error?.message ?? 'No se pudo iniciar sesión. Comprueba tus datos e inténtalo de nuevo.');
      }
    });

  }

  register(user: FormData) {
    return this.http.post<{user: User}>(this.base + '/register', user)
  }

  changePassword(id: number, data: FormData){
    let headers = new HttpHeaders().set('Authorization', `Bearer ${this.getToken()}`);
    return this.http.post<ChangePassword>(this.base + '/changePassword/'+id, data, {headers})
  }

  setToken(token: string) {
    localStorage.setItem('token', token);
  }

  logout() {
    const token = this.getToken();
    if (token) {
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      this.http.post(`${this.base}/logout`, {}, {headers}).subscribe({error: () => {}});
    }
    localStorage.removeItem('token');
    this.deleteType()
    this.router.navigate(['/login'])
  }
}

