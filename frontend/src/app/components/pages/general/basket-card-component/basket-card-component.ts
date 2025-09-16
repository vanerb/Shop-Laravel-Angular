import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Basket} from '../../../../interfaces/basket';
import {getImageUrl} from '../../../../helpers/utilities.helper';
import {Product} from '../../../../interfaces/products';

@Component({
  selector: 'app-basket-card-component',
  standalone: false,
  templateUrl: './basket-card-component.html',
  styleUrl: './basket-card-component.css'
})
export class BasketCardComponent {
  @Input() product!:Product
  @Input() viewMode: 'view' | 'editable' = 'view'
  @Output() remove: EventEmitter<Product> = new EventEmitter<Product>();



  removeProductBasket(product: Product) {
    this.remove.emit(product);
  }

  protected readonly getImageUrl = getImageUrl;
}
