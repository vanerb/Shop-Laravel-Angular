import { Routes } from '@angular/router';
import {ContactComponent} from './components/pages/contact-component/contact-component';
import {ProfileComponent} from './components/pages/profile-component/profile-component';
import {RegisterComponent} from './components/pages/register-component/register-component';
import {LoginComponent} from './components/pages/login-component/login-component';
import {IndexComponent} from './components/pages/index-component/index-component';
import {ShopComponent} from './components/pages/shop-component/shop-component';
import {BasketComponent} from './components/pages/basket-component/basket-component';
import {AdminMainComponent} from './components/pages/admin-main-component/admin-main-component';

export const routes: Routes = [
  {path: '', component: IndexComponent},
  {path: 'login', component: LoginComponent},
  {path: 'shop', component: ShopComponent},
  {path: 'basket', component: BasketComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'administration', component: AdminMainComponent},
  {path: 'profile', component: ProfileComponent},
  {path: 'contact', component: ContactComponent},
  {path: '**', redirectTo: ''}
];
