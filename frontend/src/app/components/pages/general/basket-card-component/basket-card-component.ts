import {Component, input, output} from '@angular/core';
import {getImageUrl, getProductCoverImage} from '../../../../helpers/utilities.helper';
import {Product} from '../../../../interfaces/products';

@Component({
  selector: 'app-basket-card-component',
  standalone: false,
  templateUrl: './basket-card-component.html',
  styleUrl: './basket-card-component.css'
})
export class BasketCardComponent {
  readonly product = input.required<Product>();
  readonly viewMode = input<'view' | 'editable'>('view');
  readonly remove = output<Product>();



  removeProductBasket(product: Product) {
    this.remove.emit(product);
  }

  protected readonly getImageUrl = getImageUrl;

  getCoverImage(product: Product) {
    return getProductCoverImage(product.images);
  }
}
