import { NgModule, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { BrowserModule, provideClientHydration, withEventReplay } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { AdminMainComponent } from './components/pages/admin-main-component/admin-main-component';
import { ContainerComponent } from './components/pages/general/container-component/container-component';
import { HeaderComponent } from './components/pages/header-component/header-component';
import { ModalComponent } from './components/pages/general/modal-component/modal-component';
import { AcceptButtonComponent } from './components/pages/general/accept-button-component/accept-button-component';
import { CancelButtonComponent } from './components/pages/general/cancel-button-component/cancel-button-component';
import { CategoryCardComponent } from './components/pages/general/category-card-component/category-card-component';
import { LoaderComponent } from './components/pages/general/loader-component/loader-component';
import { ProductCardComponent } from './components/pages/general/product-card-component/product-card-component';
import { BasketCardComponent } from './components/pages/general/basket-card-component/basket-card-component';
import { BasketComponent } from './components/pages/basket-component/basket-component';
import { ContactComponent } from './components/pages/contact-component/contact-component';
import { FooterComponent } from './components/pages/footer-component/footer-component';
import { IndexComponent } from './components/pages/index-component/index-component';
import { LoginComponent } from './components/pages/login-component/login-component';
import { ManageCategoriesComponent } from './components/pages/manage-categories-component/manage-categories-component';
import { ManageOrdersComponent } from './components/pages/manage-orders-component/manage-orders-component';
import { ManageProductsComponent } from './components/pages/manage-products-component/manage-products-component';
import { ManageUsersComponent } from './components/pages/manage-users-component/manage-users-component';
import { OrdersComponent } from './components/pages/orders-component/orders-component';
import { ProcessOrderComponent } from './components/pages/process-order-component/process-order-component';
import { ProfileComponent } from './components/pages/profile-component/profile-component';
import { RegisterComponent } from './components/pages/register-component/register-component';
import { ShopComponent } from './components/pages/shop-component/shop-component';
import { HttpClientModule } from '@angular/common/http';
import {ReactiveFormsModule} from '@angular/forms';
import {
  AddProductModalComponent
} from './components/pages/manage-products-component/add-product-modal-component/add-product-modal-component';
import {
  EditProductModalComponent
} from './components/pages/manage-products-component/edit-product-modal-component/edit-product-modal-component';
import { AddCategoryModalComponent } from './components/pages/manage-categories-component/add-category-modal-component/add-category-modal-component';
import { EditCategoryModalComponent } from './components/pages/manage-categories-component/edit-category-modal-component/edit-category-modal-component';
import { ConfirmationModalComponent } from './components/pages/general/confirmation-modal-component/confirmation-modal-component';

@NgModule({
  declarations: [
    App,
    AdminMainComponent,
    ContainerComponent,
    HeaderComponent,
    ModalComponent,
    AcceptButtonComponent,
    CancelButtonComponent,
    CategoryCardComponent,
    LoaderComponent,
    ProductCardComponent,
    BasketCardComponent,
    BasketComponent,
    ContactComponent,
    FooterComponent,
    IndexComponent,
    LoginComponent,
    ManageCategoriesComponent,
    ManageOrdersComponent,
    ManageProductsComponent,
    ManageUsersComponent,
    OrdersComponent,
    ProcessOrderComponent,
    ProfileComponent,
    RegisterComponent,
    ShopComponent,
    AddProductModalComponent,
    EditProductModalComponent,
    AddCategoryModalComponent,
    EditCategoryModalComponent,
    ConfirmationModalComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
  ],
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideClientHydration(withEventReplay())
  ],
  bootstrap: [App]
})
export class AppModule { }
