import {ChangeDetectorRef, Component, Input} from '@angular/core';
import {Product} from '../../../../interfaces/products';
import {BasketService} from '../../../../services/basket-service';
import {Category} from '../../../../interfaces/categories';
import {AddProductBasket} from '../../../../interfaces/basket';

@Component({
  selector: 'app-product-card-component',
  standalone: false,
  templateUrl: './product-card-component.html',
  styleUrl: './product-card-component.css'
})
export class ProductCardComponent {

  @Input() item?: Product;

  constructor(private  readonly basketService: BasketService, private cd: ChangeDetectorRef) {
  }

  getImageUrl(item: Product | undefined): string {
    if (!item || !item.images || item.images.length === 0) {
      return 'http://localhost:8000/storage/general/no_image.jpg'; // Imagen por defecto si no hay
    }
    return `http://localhost:8000/storage/${item.images[0].path}`;
  }



  addProductBasket(item: Product | undefined){
    console.log("CLICK")
    const command: AddProductBasket = {
      "product_id": item?.id  ?? 0,
      "quantity": 1
    }
    this.basketService.addProductBasket(command).subscribe({
      next: basket_product  => {

        this.cd.detectChanges();
      },
      error: (err) => console.error("Error al cargar productos", err)
    });
  }




}
