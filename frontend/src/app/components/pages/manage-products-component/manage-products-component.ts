import {ChangeDetectorRef, Component, NgZone, OnInit} from '@angular/core';
import {Product} from '../../../interfaces/products';
import {ProductsService} from '../../../services/products-service';
import {UtilitiesService} from '../../../services/utilities-service';
import {
  AddCategoryModalComponent
} from '../manage-categories-component/add-category-modal-component/add-category-modal-component';
import {Category} from '../../../interfaces/categories';
import {ModalService} from '../../../services/modal-service';
import {AddProductModalComponent} from './add-product-modal-component/add-product-modal-component';
import {ConfirmationModalComponent} from '../general/confirmation-modal-component/confirmation-modal-component';
import {EditProductModalComponent} from './edit-product-modal-component/edit-product-modal-component';
import {AuthService} from '../../../services/auth-service';

@Component({
  selector: 'app-manage-products-component',
  standalone: false,
  templateUrl: './manage-products-component.html',
  styleUrl: './manage-products-component.css'
})
export class ManageProductsComponent implements OnInit {
  products: Product[] = []
  type: string | false | null = false;
  constructor(private productsService: ProductsService, private cd: ChangeDetectorRef, private readonly utilitiesService: UtilitiesService, private readonly modalService: ModalService,private zone: NgZone, private authService: AuthService) {

  }

  ngOnInit() {

    this.type = this.authService.getType()

    if(this.type === 'admin'){
      this.productsService.getAllProducts().subscribe({
        next: async (products: Product[]) => {
          this.products = products
          this.cd.detectChanges();
        },
        error: err => console.error("Error al cargar productos", err)
      });
    }
    else{
      this.productsService.getAllProductsByUser().subscribe({
        next: async (products: Product[]) => {
          this.products = products
          this.cd.detectChanges();
        },
        error: err => console.error("Error al cargar productos", err)
      });
    }



  }

  getImageUrl(item: Product | undefined): string {
    if (!item || !item.images || item.images.length === 0) {
      return 'http://localhost:8000/storage/general/no_image.jpg';
    }
    return `http://localhost:8000/storage/${item.images[0].path}`;
  }


  getDates(date: string){
    return this.utilitiesService.transformDate(date)
  }

  add(){
    console.log("CLICK")
    this.modalService.open(AddProductModalComponent, {
        width: '90%',

      },
      {}).then(async (item: FormData) => {

      this.productsService.create(item).subscribe({
        next: async () => {
          this.productsService.getAllProductsByUser().subscribe({
            next: (products: Product[]) => {
                this.products = products
              this.cd.detectChanges();

            },
            error: err => console.error("Error al cargar productos", err)
          });
        },
        error: (err) => {

        }
      });


    })
      .catch(() => {
        this.modalService.close()
      });
  }


  update(product: Product){
    console.log("CLICK")
    this.modalService.open(EditProductModalComponent, {
        width: '90%',

      },
      { product: product }).then(async (item: FormData) => {

      this.productsService.update(product.id, item).subscribe({
        next: async () => {
          this.productsService.getAllProductsByUser().subscribe({
            next: (products: Product[]) => {
              this.products = products
              this.cd.detectChanges();

            },
            error: err => console.error("Error al cargar productos", err)
          });
        },
        error: (err) => {

        }
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
          this.productsService.getAllProductsByUser().subscribe({
            next: (products: Product[]) => {
              this.products = products
              this.cd.detectChanges();
            },
            error: (err) => console.error("Error al cargar productos", err)
          });
        },
        error: (err) => {

        }
      });
    })
      .catch(() => {
        this.modalService.close()
      });
  }
}
