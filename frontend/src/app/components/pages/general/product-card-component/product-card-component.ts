import {Component, Input} from '@angular/core';
import {Product} from '../../../../interfaces/products';

@Component({
  selector: 'app-product-card-component',
  standalone: false,
  templateUrl: './product-card-component.html',
  styleUrl: './product-card-component.css'
})
export class ProductCardComponent {

  @Input() item?: Product;

  getImageUrl(item: Product | undefined): string {
    if (!item || !item.images || item.images.length === 0) {
      return 'http://localhost:8000/storage/general/no_image.jpg'; // Imagen por defecto si no hay
    }
    return `http://localhost:8000/storage/${item.images[0].path}`;
  }
}
