import {Component, computed, OnInit, signal} from '@angular/core';
import {Order} from '../../../interfaces/order';
import {BasketService} from '../../../services/basket-service';
import {AuthService} from '../../../services/auth-service';

@Component({
  selector: 'app-orders-component',
  standalone: false,
  templateUrl: './orders-component.html',
  styleUrl: './orders-component.css'
})
export class OrdersComponent implements OnInit{
  readonly orders = signal<Order[]>([]);
  readonly type = signal<string | null | false>(false);
  readonly loading = signal(true);
  readonly errorMessage = signal('');
  readonly page = signal(1);
  readonly pageSize = 12;
  readonly paginatedOrders = computed(() => {
    const start = (this.page() - 1) * this.pageSize;
    return this.orders().slice(start, start + this.pageSize);
  });

  constructor(private basketService: BasketService, private authService: AuthService) {}

  ngOnInit() {
    this.type.set(this.authService.getType())

    if(this.type() === 'admin'){
      this.basketService.getAllOrder().subscribe({
        next: (orders: Order[]) => {
          this.orders.set([...orders]);
          this.loading.set(false);
        },
        error: err => this.showLoadError(err)
      });
    }
    else{
      this.basketService.getAllOrderByUser().subscribe({
        next: (orders: Order[]) => {
          this.orders.set([...orders]);
          this.loading.set(false);
        },
        error: err => this.showLoadError(err)
      });
    }
  }

  private showLoadError(error: any) {
    this.loading.set(false);
    this.errorMessage.set(error?.error?.message ?? 'No se pudieron cargar tus pedidos. Inténtalo de nuevo.');
  }
}
