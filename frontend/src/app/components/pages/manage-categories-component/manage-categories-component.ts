import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {Product} from '../../../interfaces/products';
import {ProductsService} from '../../../services/products-service';
import {UtilitiesService} from '../../../services/utilities-service';
import {Category} from '../../../interfaces/categories';
import {CategoriesService} from '../../../services/categories-service';
import {ModalService} from '../../../services/modal-service';
import {AddCategoryModalComponent} from './add-category-modal-component/add-category-modal-component';
import {EditCategoryModalComponent} from './edit-category-modal-component/edit-category-modal-component';
import {ConfirmationModalComponent} from '../general/confirmation-modal-component/confirmation-modal-component';
import {User} from '../../../interfaces/users';
import {AuthService} from '../../../services/auth-service';

@Component({
  selector: 'app-manage-categories-component',
  standalone: false,
  templateUrl: './manage-categories-component.html',
  styleUrl: './manage-categories-component.css'
})
export class ManageCategoriesComponent implements OnInit {
  categories: Category[] = []

  type: string | null | false = null;

  constructor(private categoriesService: CategoriesService, private cd: ChangeDetectorRef, private readonly utilitiesService: UtilitiesService, private modalService: ModalService, private authService: AuthService) {}

  ngOnInit() {

    this.type = this.authService.getType()

    if(this.type === 'admin'){
      this.categoriesService.getAllCategories().subscribe({
        next: (categories: Category[]) => {
          this.categories = [...categories]; // forzar nueva referencia
          this.cd.detectChanges();
        },
        error: (err) => console.error("Error al cargar productos", err)
      });
    }
    else{
      this.categoriesService.getAllCategoriesByUser().subscribe({
        next: (categories: Category[]) => {
          this.categories = [...categories]; // forzar nueva referencia
          this.cd.detectChanges();
        },
        error: (err) => console.error("Error al cargar productos", err)
      });
    }


  }


  getDates(date: string){
    return this.utilitiesService.transformDate(date)
  }

  add(){
    console.log("CLICK")
    this.modalService.open(AddCategoryModalComponent, {
        width: '90%',

      },
      {}).then(async (item: FormData) => {

      this.categoriesService.create(item).subscribe({
        next: async () => {
          this.categoriesService.getAllCategoriesByUser().subscribe({
            next: (categories: Category[]) => {
              this.categories = [...categories]; // forzar nueva referencia
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


  update(category: Category){
    this.modalService.open(EditCategoryModalComponent, {
        width: '90%',

      },
      { category: category }).then(async (item: FormData) => {
      this.categoriesService.update(category.id, item).subscribe({
        next: async () => {
          this.categoriesService.getAllCategoriesByUser().subscribe({
            next: (categories: Category[]) => {
              this.categories = [...categories]; // forzar nueva referencia
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


  delete(category: Category){
    this.modalService.open(ConfirmationModalComponent, {
           width: '90%',

            },
          { title: 'Eliminar', message: '¿Está seguro de que quiere eliminar el elemento '+category.name+"?" }).then(async (item: FormData) => {
            this.categoriesService.delete(category.id).subscribe({
              next: async () => {
                this.categoriesService.getAllCategoriesByUser().subscribe({
                  next: (categories: Category[]) => {
                    this.categories = [...categories]; // forzar nueva referencia
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
