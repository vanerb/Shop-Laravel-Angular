import {Component, OnInit, ChangeDetectorRef, PLATFORM_ID, Inject} from '@angular/core';
import {Product} from '../../../interfaces/products';
import {ProductsService} from '../../../services/products-service';


@Component({
  selector: 'app-shop-component',
  standalone: false,
  templateUrl: './shop-component.html',
  styleUrl: './shop-component.css'
})
export class ShopComponent implements OnInit {
  products: Product[] = []

  constructor(private productsService: ProductsService, private cd: ChangeDetectorRef) {}

   ngOnInit() {
      this.productsService.getAllProductsByUser().subscribe({
        next: (products: Product[]) => {
          this.products = products; // forzar nueva referencia
          console.log("PRODUCTOS RECIBIDOS", this.products);
          this.cd.detectChanges();
        },
        error: err => console.error("Error al cargar productos", err)
      });
  }



}
