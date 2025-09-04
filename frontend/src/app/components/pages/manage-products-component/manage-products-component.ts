import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {Product} from '../../../interfaces/products';
import {ProductsService} from '../../../services/products-service';
import {UtilitiesService} from '../../../services/utilities-service';

@Component({
  selector: 'app-manage-products-component',
  standalone: false,
  templateUrl: './manage-products-component.html',
  styleUrl: './manage-products-component.css'
})
export class ManageProductsComponent implements OnInit {
  products: Product[] = []

  constructor(private productsService: ProductsService, private cd: ChangeDetectorRef, private readonly utilitiesService: UtilitiesService) {}

  ngOnInit() {
    this.productsService.getAllProductsByUser().subscribe({
      next: (products: Product[]) => {
        this.products = [...products]; // forzar nueva referencia
        console.log("PRODUCTOS RECIBIDOS", this.products);
        this.cd.detectChanges();
      },
      error: err => console.error("Error al cargar productos", err)
    });
  }

  getImageUrl(item: Product | undefined): string {
    if (!item || !item.images || item.images.length === 0) {
      return 'http://localhost:8000/storage/general/no_image.jpg'; // Imagen por defecto si no hay
    }
    return `http://localhost:8000/storage/${item.images[0].path}`;
  }


  getDates(date: string){
    return this.utilitiesService.transformDate(date)
  }
}
