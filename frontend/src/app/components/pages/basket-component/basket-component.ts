import {Component, computed, OnInit, signal} from '@angular/core';
import {Router} from '@angular/router';
import {Basket} from '../../../interfaces/basket';
import {BasketService} from '../../../services/basket-service';
import {Product} from '../../../interfaces/products';
import {calculateTotal, getImageUrl, getProductCoverImage} from '../../../helpers/utilities.helper';

@Component({
  selector: 'app-basket-component',
  standalone: false,
  templateUrl: './basket-component.html',
  styleUrl: './basket-component.css'
})
export class BasketComponent implements OnInit {
  readonly basket = signal<Basket>({id: 0, user_id: 0, finished: 0, created_at: '', updated_at: '', products: []});
  readonly page = signal(1);
  readonly pageSize = 8;
  readonly paginatedProducts = computed(() => {
    const start = (this.page() - 1) * this.pageSize;
    return this.basket().products.slice(start, start + this.pageSize);
  });
  constructor(private readonly router: Router,private basketService: BasketService) {
  }


  ngOnInit() {
    this.basketService.getAllBasketByUser().subscribe({
      next: (basket: Basket) => {
        if(basket.finished === 0) this.basket.set(basket);
      },
      error: (err) => console.error("Error al cargar productos", err)
    });
  }


  getImageUrl(item: Product | undefined): string {
      return getImageUrl(getProductCoverImage(item?.images))
  }



   async goToProcess() {
     if (!this.basket().products.length) return;
     await this.router.navigate(['/process-order/'+this.basket().id]);

   }

  calculateTotal(){
    return calculateTotal(this.basket().products)
  }


  removeProductBasket(item: Product | undefined){

    if(item !== undefined){
      this.basketService.removeProductBasket(item?.id ?? 0).subscribe({
        next: basket_product  => {

          this.basketService.getAllBasketByUser().subscribe({
            next: (basket: Basket) => {
              if(basket.finished === 0){
                this.basket.set(basket);
                const pageCount = Math.max(1, Math.ceil(basket.products.length / this.pageSize));
                this.page.update(page => Math.min(page, pageCount));
              }
            },
            error: (err) => console.error("Error al cargar productos", err)
          });
        },
        error: (err) => console.error("Error al cargar productos", err)
      });
    }

  }
}
