import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ContactComponent} from './components/pages/contact-component/contact-component';
import {ProfileComponent} from './components/pages/profile-component/profile-component';
import {RegisterComponent} from './components/pages/register-component/register-component';
import {LoginComponent} from './components/pages/login-component/login-component';
import {IndexComponent} from './components/pages/index-component/index-component';
import {ShopComponent} from './components/pages/shop-component/shop-component';
import {BasketComponent} from './components/pages/basket-component/basket-component';
import {AdminMainComponent} from './components/pages/admin-main-component/admin-main-component';
import {ManageProductsComponent} from './components/pages/manage-products-component/manage-products-component';
import {ManageCategoriesComponent} from './components/pages/manage-categories-component/manage-categories-component';
import {ManageUsersComponent} from './components/pages/manage-users-component/manage-users-component';
import {ManageOrdersComponent} from './components/pages/manage-orders-component/manage-orders-component';
import {OrdersComponent} from './components/pages/orders-component/orders-component';

const routes: Routes = [
  {path: '', component: IndexComponent},
  {path: 'login', component: LoginComponent},
  {path: 'shop', component: ShopComponent},
  {path: 'basket', component: BasketComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'admin-products', component: ManageProductsComponent},
  {path: 'admin-categories', component: ManageCategoriesComponent},
  {path: 'admin-users', component: ManageUsersComponent},
  {path: 'admin-orders', component: ManageOrdersComponent},
  {path: 'my-orders', component: OrdersComponent},
  {path: 'process-order', component: OrdersComponent},
  {path: 'administration', component: AdminMainComponent},
  {path: 'profile', component: ProfileComponent},
  {path: 'contact', component: ContactComponent},
  {path: '**', redirectTo: ''}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
