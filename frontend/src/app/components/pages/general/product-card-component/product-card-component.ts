import {Component, input} from '@angular/core';
import {Product} from '../../../../interfaces/products';
import {BasketService} from '../../../../services/basket-service';
import {AddProductBasket} from '../../../../interfaces/basket';
import {ModalService} from '../../../../services/modal-service';
import {DetailComponent} from '../../detail-component/detail-component';
import {getImageUrl, getProductCoverImage} from '../../../../helpers/utilities.helper';
import {AuthService} from '../../../../services/auth-service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-product-card-component',
  standalone: false,
  templateUrl: './product-card-component.html',
  styleUrl: './product-card-component.css'
})
export class ProductCardComponent {

  readonly item = input<Product>();

  constructor(private readonly basketService: BasketService, private readonly authService: AuthService, private readonly router: Router, private modalService: ModalService) {
  }

  getImageUrl(item: Product | undefined): string {
   return getImageUrl(getProductCoverImage(item?.images))
  }



  addProductBasket(item: Product | undefined){
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    const command: AddProductBasket = {
      "product_id": item?.id  ?? 0,
      "quantity": 1
    }
    this.basketService.addProductBasket(command).subscribe({
      next: basket_product  => {

      },
      error: (err) => console.error("Error al cargar productos", err)
    });
  }


  openDetails(item: Product | undefined){
    this.modalService.open(DetailComponent, {
      width: 'min(1100px, 94vw)',
      'max-width': 'min(1100px, 94vw)',
    }, {product: item}).then( (product: Product) => {

      this.addProductBasket(product)


    })
      .catch(() => {
        this.modalService.close()
      });

  }




}
