import { Component } from '@angular/core';
import {ContainerComponent} from '../general/container-component/container-component';
import {ProductCardComponent} from '../general/product-card-component/product-card-component';

@Component({
  selector: 'app-shop-component',
  imports: [ContainerComponent,ProductCardComponent],
  templateUrl: './shop-component.html',
  standalone: true,
  styleUrl: './shop-component.css'
})
export class ShopComponent {

}
