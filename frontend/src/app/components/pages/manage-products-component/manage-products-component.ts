import {Component, computed, OnInit, signal} from '@angular/core';
import {Product} from '../../../interfaces/products';
import {ProductsService} from '../../../services/products-service';
import {ModalService} from '../../../services/modal-service';
import {AddProductModalComponent} from './add-product-modal-component/add-product-modal-component';
import {ConfirmationModalComponent} from '../general/confirmation-modal-component/confirmation-modal-component';
import {EditProductModalComponent} from './edit-product-modal-component/edit-product-modal-component';
import {AuthService} from '../../../services/auth-service';
import {getImageUrl, getProductCoverImage, transformDate} from '../../../helpers/utilities.helper';

@Component({
  selector: 'app-manage-products-component',
  standalone: false,
  templateUrl: './manage-products-component.html',
  styleUrl: './manage-products-component.css'
})
export class ManageProductsComponent implements OnInit {
  readonly products = signal<Product[]>([]);
  readonly type = signal<string | false | null>(false);
  readonly notice = signal('');
  readonly page = signal(1);
  readonly pageSize = 12;
  readonly paginatedProducts = computed(() => {
    const start = (this.page() - 1) * this.pageSize;
    return this.products().slice(start, start + this.pageSize);
  });
  constructor(private productsService: ProductsService, private readonly modalService: ModalService, private authService: AuthService) {

  }

  ngOnInit() {

    this.type.set(this.authService.getType())

    this.loadProducts();

  }

  private loadProducts(): void {
    const request = this.type() === 'admin' ? this.productsService.getAllProducts() : this.productsService.getAllProductsByUser();
    request.subscribe({
      next: products => { this.products.set(products); this.page.set(1); this.notice.set(''); },
      error: () => { this.notice.set('No se pudieron cargar los productos. Inténtalo de nuevo.'); }
    });
  }

  getImageUrl(item: Product | undefined): string {
   return  getImageUrl(getProductCoverImage(item?.images))
  }


  getDates(date: string){
    return transformDate(date)
  }

  add(){
    this.modalService.open(AddProductModalComponent, {
        width: '90%',

      },
      {}).then(async (item: FormData) => {

      this.productsService.create(item).subscribe({
        next: async () => {
          this.notice.set('Producto creado correctamente.');
          this.loadProducts();
        },
        error: () => { this.notice.set('No se pudo crear el producto. Revisa los datos e inténtalo de nuevo.'); }
      });


    })
      .catch(() => {
        this.modalService.close()
      });
  }


  update(product: Product){
    this.modalService.open(EditProductModalComponent, {
        width: '90%',

      },
      { product: product }).then(async (item: FormData) => {

      this.productsService.update(product.id, item).subscribe({
        next: async () => {
          this.notice.set('Producto actualizado correctamente.');
          this.loadProducts();
        },
        error: () => { this.notice.set('No se pudo actualizar el producto. Revisa los datos e inténtalo de nuevo.'); }
      });


    })
      .catch(() => {
        this.modalService.close()
      });
  }

  delete(product: Product){
    this.modalService.open(ConfirmationModalComponent, {
        width: '90%',

      },
      { title: 'Eliminar', message: '¿Está seguro de que quiere eliminar el elemento '+product.name+"?" }).then(async (item: FormData) => {
      this.productsService.delete(product.id).subscribe({
        next: () => {
          this.products.update(products => products.filter(item => item.id !== product.id));
          this.page.update(page => Math.min(page, Math.max(1, Math.ceil(this.products().length / this.pageSize))));
          this.notice.set('Producto eliminado correctamente.');
        },
        error: () => { this.notice.set('No se pudo eliminar el producto.'); }
      });
    })
      .catch(() => {
        this.modalService.close()
      });
  }
}
