import {Component, computed, OnInit, signal} from '@angular/core';
import {Category} from '../../../interfaces/categories';
import {CategoriesService} from '../../../services/categories-service';
import {ModalService} from '../../../services/modal-service';
import {AddCategoryModalComponent} from './add-category-modal-component/add-category-modal-component';
import {EditCategoryModalComponent} from './edit-category-modal-component/edit-category-modal-component';
import {ConfirmationModalComponent} from '../general/confirmation-modal-component/confirmation-modal-component';
import {AuthService} from '../../../services/auth-service';
import {transformDate} from '../../../helpers/utilities.helper';

@Component({
  selector: 'app-manage-categories-component',
  standalone: false,
  templateUrl: './manage-categories-component.html',
  styleUrl: './manage-categories-component.css'
})
export class ManageCategoriesComponent implements OnInit {
  readonly categories = signal<Category[]>([]);
  readonly type = signal<string | null | false>(null);
  readonly notice = signal('');
  readonly page = signal(1);
  readonly pageSize = 12;
  readonly paginatedCategories = computed(() => {
    const start = (this.page() - 1) * this.pageSize;
    return this.categories().slice(start, start + this.pageSize);
  });

  constructor(private categoriesService: CategoriesService, private modalService: ModalService, private authService: AuthService) {}

  ngOnInit() {

    this.type.set(this.authService.getType())

    this.loadCategories();
  }

  private loadCategories(): void {
    this.categoriesService.getAllCategoriesByUser().subscribe({
      next: categories => { this.categories.set([...categories]); this.page.set(1); this.notice.set(''); },
      error: () => { this.notice.set('No se pudieron cargar las categorías. Inténtalo de nuevo.'); }
    });
  }


  getDates(date: string){
    return transformDate(date)
  }

  add(){
    this.modalService.open(AddCategoryModalComponent, {
        width: '90%',

      },
      {}).then(async (item: FormData) => {

      this.categoriesService.create(item).subscribe({
        next: async () => {
          this.notice.set('Categoría creada correctamente.');
          this.loadCategories();
        },
        error: () => { this.notice.set('No se pudo crear la categoría. Revisa los datos e inténtalo de nuevo.'); }
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
          this.notice.set('Categoría actualizada correctamente.');
          this.loadCategories();
        },
        error: () => { this.notice.set('No se pudo actualizar la categoría.'); }
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
                this.categories.update(categories => categories.filter(item => item.id !== category.id));
                this.page.update(page => Math.min(page, Math.max(1, Math.ceil(this.categories().length / this.pageSize))));
                this.notice.set('Categoría eliminada correctamente.');
        },
        error: () => { this.notice.set('No se pudo eliminar la categoría. Puede que tenga productos asociados.'); }
      });
    })
      .catch(() => {
        this.modalService.close()
      });


  }
}
