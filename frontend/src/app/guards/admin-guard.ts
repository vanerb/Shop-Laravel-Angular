import {Injectable} from '@angular/core';
import {CanActivate, Router, UrlTree} from '@angular/router';
import {Observable, catchError, map, of} from 'rxjs';
import {AuthService} from '../services/auth-service';

@Injectable({providedIn: 'root'})
export class AdminGuard implements CanActivate {
  constructor(private readonly authService: AuthService, private readonly router: Router) {}

  canActivate(): Observable<boolean | UrlTree> {
    if (!this.authService.isLoggedIn()) {
      return of(this.router.createUrlTree(['/login']));
    }

    return this.authService.getUserByToken().pipe(
      map(user => {
        this.authService.setType(user.type);
        return user.type === 'admin' || this.router.createUrlTree(['/shop']);
      }),
      catchError(() => of(this.router.createUrlTree(['/login'])))
    );
  }
}
