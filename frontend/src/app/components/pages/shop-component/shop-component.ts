import {Component, OnInit, computed, signal} from '@angular/core';
import {Product} from '../../../interfaces/products';
import {ProductsService} from '../../../services/products-service';
import {getImageUrl, getProductCoverImage} from '../../../helpers/utilities.helper';


@Component({
  selector: 'app-shop-component',
  standalone: false,
  templateUrl: './shop-component.html',
  styleUrl: './shop-component.css'
})
export class ShopComponent implements OnInit {
  readonly products = signal<Product[]>([]);
  readonly categories = signal<string[]>([]);
  readonly selectedCategory = signal('Todas');
  readonly searchTerm = signal('');
  readonly loading = signal(true);
  readonly page = signal(1);
  readonly pageSize = 12;
  readonly filteredProducts = computed(() => {
    const query = this.searchTerm().trim().toLocaleLowerCase('es');
    return this.products().filter(product => {
      const matchesCategory = this.selectedCategory() === 'Todas' || product.category?.name === this.selectedCategory();
      const matchesSearch = !query || `${product.name} ${product.description} ${product.category?.name ?? ''}`.toLocaleLowerCase('es').includes(query);
      return matchesCategory && matchesSearch;
    });
  });
  readonly paginatedProducts = computed(() => {
    const start = (this.page() - 1) * this.pageSize;
    return this.filteredProducts().slice(start, start + this.pageSize);
  });

  selectCategory(category: string) {
    this.selectedCategory.set(category);
    this.page.set(1);
  }

  setSearchTerm(value: string): void {
    this.searchTerm.set(value);
    this.page.set(1);
  }

  getImageUrl(product: Product) {
    return getImageUrl(getProductCoverImage(product.images));
  }

  constructor(private productsService: ProductsService) {}

   ngOnInit() {
      this.productsService.getAllProducts().subscribe({
        next: (products: Product[]) => {
          this.products.set(products);
          this.categories.set([...new Set(products.map(product => product.category?.name).filter((name): name is string => !!name))]);
          this.loading.set(false);
        },
        error: () => {
          this.loading.set(false);
        }
      });
  }



}
