import {ChangeDetectorRef, Component, Input} from '@angular/core';
import {Product} from '../../../../interfaces/products';
import {BasketService} from '../../../../services/basket-service';
import {Category} from '../../../../interfaces/categories';
import {AddProductBasket} from '../../../../interfaces/basket';
import {ModalService} from '../../../../services/modal-service';
import {DetailComponent} from '../../detail-component/detail-component';
import {UtilitiesService} from '../../../../services/utilities-service';

@Component({
  selector: 'app-product-card-component',
  standalone: false,
  templateUrl: './product-card-component.html',
  styleUrl: './product-card-component.css'
})
export class ProductCardComponent {

  @Input() item?: Product;

  constructor(private  readonly basketService: BasketService, private cd: ChangeDetectorRef, private modalService: ModalService,private readonly utilitiesService: UtilitiesService) {
  }

  getImageUrl(item: Product | undefined): string {
   return this.utilitiesService.getImageUrl(item?.images[0])
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


  openDetails(item: Product | undefined){
    this.modalService.open(DetailComponent, {
      width: '90%',
    }, {product: item}).then( (product: Product) => {

      this.addProductBasket(product)


    })
      .catch(() => {
        this.modalService.close()
      });

  }




}
