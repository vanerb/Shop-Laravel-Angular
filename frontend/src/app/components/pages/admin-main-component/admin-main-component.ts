import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from '../../../services/auth-service';
import {User} from '../../../interfaces/users';

@Component({
  selector: 'app-admin-main-component',
  standalone: false,
  templateUrl: './admin-main-component.html',
  styleUrl: './admin-main-component.css'
})
export class AdminMainComponent implements OnInit{
  type!: string
  constructor(private  readonly router: Router, private readonly authService: AuthService,private cd: ChangeDetectorRef) {
  }
  async goToUrl(url: string) {
    await this.router.navigate([url])
  }


  ngOnInit() {
   this.authService.getUserByToken().subscribe({
     next: async (user: User) => {
       this.type = user.type
       this.cd.detectChanges()
       console.log("TIPO", this.type)
     },
     error: (err) => console.error("Error al cargar productos", err)
   });
  }



}
