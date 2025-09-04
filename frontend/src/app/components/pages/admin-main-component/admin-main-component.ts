import { Component } from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-admin-main-component',
  standalone: false,
  templateUrl: './admin-main-component.html',
  styleUrl: './admin-main-component.css'
})
export class AdminMainComponent {
  constructor(private  readonly router: Router,) {
  }
  async goToUrl(url: string) {
    await this.router.navigate([url])
  }
}
