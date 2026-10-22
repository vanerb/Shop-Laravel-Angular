import {Component, OnInit, signal} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from '../../../services/auth-service';
import {User} from '../../../interfaces/users';
import {API_ORIGIN} from '../../../services/api-base-url';

@Component({
  selector: 'app-admin-main-component',
  standalone: false,
  templateUrl: './admin-main-component.html',
  styleUrl: './admin-main-component.css'
})
export class AdminMainComponent implements OnInit{
  readonly type = signal<string | null>(null);
  readonly apiOrigin = API_ORIGIN;
  constructor(private  readonly router: Router, private readonly authService: AuthService) {
  }
  async goToUrl(url: string) {
    await this.router.navigate([url])
  }


  ngOnInit() {
   this.authService.getUserByToken().subscribe({
     next: async (user: User) => {
       if (user.type !== 'admin') {
         await this.router.navigate(['/shop']);
         return;
       }
       this.type.set(user.type)
     },
      error: () => this.router.navigate(['/shop'])
   });
  }



}
