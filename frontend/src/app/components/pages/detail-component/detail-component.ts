import { Component } from '@angular/core';
import {Images, Product} from '../../../interfaces/products';
import { getImageUrl } from '../../../helpers/utilities.helper';

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

  constructor() {
  }

  getImageUrl(item: Images | undefined): string {
    return getImageUrl(item)
  }

  getCoverImage(){
    return this.product.images.filter(el=>el.from === 'cover')[0]
  }

  addProductBasket(item: Product | undefined){
    this.confirm(item)
  }
}
