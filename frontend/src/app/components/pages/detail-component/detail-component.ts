import { Component } from '@angular/core';
import {Images, Product} from '../../../interfaces/products';

@Component({
  selector: 'app-detail-component',
  standalone: false,
  templateUrl: './detail-component.html',
  styleUrl: './detail-component.css'
})
export class DetailComponent {

  product!: Product

  confirm!: (result?: any) => void;
  close!: () => void;

  getImageUrl(item: Product | undefined): string {
    if (!item || !item.images || item.images.length === 0) {
      return 'http://localhost:8000/storage/general/no_image.jpg'; // Imagen por defecto si no hay
    }
    return `http://localhost:8000/storage/${item.images[0].path}`;
  }

  getCoverImage(){
    return this.product.images.find(el=>el.from === 'cover')
  }

  returnImage(image: Images | undefined) {
    return image ? `http://localhost:8000/image/${image.path.replace(/^images\//, '')}` : 'http://localhost:8000/storage/general/no_image.jpg';

  }

  addProductBasket(item: Product | undefined){
    this.confirm(item)
  }
}
