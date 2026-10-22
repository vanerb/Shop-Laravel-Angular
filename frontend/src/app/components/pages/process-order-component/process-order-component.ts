import {Component, computed, OnInit, signal} from '@angular/core';
import {Product} from '../../../interfaces/products';
import {BasketService} from '../../../services/basket-service';
import {CreateOrder} from '../../../interfaces/order';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {Basket} from '../../../interfaces/basket';
import {calculateTotal, getImageUrl, getProductCoverImage} from '../../../helpers/utilities.helper';

@Component({
  selector: 'app-process-order-component',
  standalone: false,
  templateUrl: './process-order-component.html',
  styleUrl: './process-order-component.css'
})
export class ProcessOrderComponent implements OnInit{
  readonly products = signal<Product[]>([]);
  form!: FormGroup;
  readonly orderId = signal(0);
  readonly basket = signal<Basket>({id: 0, user_id: 0, finished: 0, created_at: '', updated_at: '', products: []});
  readonly submitting = signal(false);
  readonly errorMessage = signal('');
  readonly page = signal(1);
  readonly pageSize = 6;
  readonly paginatedProducts = computed(() => this.basket().products.slice((this.page() - 1) * this.pageSize, this.page() * this.pageSize));

  constructor(private basketService: BasketService,private fb: FormBuilder,private route: ActivatedRoute, private router: Router) {
    this.form = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      direction: ['', [Validators.required]],
      zip: ['', [Validators.required]],
      city: ['', [Validators.required]],
      country: ['', [Validators.required]],
    });
  }

  ngOnInit() {
    this.orderId.set(Number.parseInt(this.route.snapshot.paramMap.get('id')!));

    this.basketService.getBasketById(this.orderId()).subscribe({
      next: (basket: Basket) => {
        if(basket.finished === 0){
          this.basket.set(basket);
          this.products.set(basket.products);
        }
      },
      error: (err) => console.error("Error al cargar productos", err)
    });
  }

  createPayment() {
    if (this.form.invalid || !this.basket().products.length || this.submitting()) {
      this.form.markAllAsTouched();
      this.errorMessage.set(this.basket().products.length ? 'Revisa los datos del formulario.' : 'Añade algún producto antes de continuar.');
      return;
    }

    this.errorMessage.set('');
    this.submitting.set(true);
    let order: CreateOrder = {
      "basket_id": this.orderId(),
      "name": this.form.get('name')?.value,
      "email": this.form.get('email')?.value,
      "direction": this.form.get('direction')?.value,
      "city": this.form.get('city')?.value,
      "zip": this.form.get('zip')?.value,
      "country": this.form.get('country')?.value
    }

    this.basketService.createOrder(order).subscribe({
      next: async () => {
        this.submitting.set(false);
        await this.router.navigate(['my-orders']);
      },
      error: err => {
        this.submitting.set(false);
        this.errorMessage.set(err?.error?.message ?? 'No se pudo completar el pedido. Inténtalo de nuevo.');
      }
    });
  }

  calculateTotal() { return calculateTotal(this.basket().products); }

  getImageUrl(product: Product) { return getImageUrl(getProductCoverImage(product.images)); }

  lineTotal(product: Product) { return (Number(product.price) * product.pivot.quantity).toFixed(2); }




}
