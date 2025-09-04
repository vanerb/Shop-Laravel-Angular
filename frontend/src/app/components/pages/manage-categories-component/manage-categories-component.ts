import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {Product} from '../../../interfaces/products';
import {ProductsService} from '../../../services/products-service';
import {UtilitiesService} from '../../../services/utilities-service';
import {Category} from '../../../interfaces/categories';
import {CategoriesService} from '../../../services/categories-service';

@Component({
  selector: 'app-manage-categories-component',
  standalone: false,
  templateUrl: './manage-categories-component.html',
  styleUrl: './manage-categories-component.css'
})
export class ManageCategoriesComponent implements OnInit {
  categories: Category[] = []

  constructor(private categoriesService: CategoriesService, private cd: ChangeDetectorRef, private readonly utilitiesService: UtilitiesService) {}

  ngOnInit() {
    this.categoriesService.getAllCategoriesByUser().subscribe({
      next: (categories: Category[]) => {
        this.categories = [...categories]; // forzar nueva referencia
        this.cd.detectChanges();
      },
      error: (err) => console.error("Error al cargar productos", err)
    });
  }


  getDates(date: string){
    return this.utilitiesService.transformDate(date)
  }
}
