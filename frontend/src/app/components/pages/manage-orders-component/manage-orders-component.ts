import { Component, computed, OnInit, signal } from '@angular/core';
import { BasketService } from '../../../services/basket-service';
import { Order } from '../../../interfaces/order';

@Component({
  selector: 'app-manage-orders-component',
  standalone: false,
  templateUrl: './manage-orders-component.html',
  styleUrl: './manage-orders-component.css'
})
export class ManageOrdersComponent implements OnInit {
  readonly orders = signal<Order[]>([]);
  readonly loading = signal(true);
  readonly notice = signal('');
  readonly page = signal(1);
  readonly pageSize = 12;
  readonly paginatedOrders = computed(() => {
    const start = (this.page() - 1) * this.pageSize;
    return this.orders().slice(start, start + this.pageSize);
  });
  readonly statuses = ['pending', 'processing', 'completed', 'cancelled'];

  constructor(private readonly basketService: BasketService) {}

  ngOnInit(): void { this.loadOrders(); }

  loadOrders(): void {
    this.loading.set(true);
    this.basketService.getAllOrder().subscribe({
      next: orders => {
        this.orders.set(Array.isArray(orders) ? [...orders] : []);
        this.page.set(1);
        this.loading.set(false);
        this.notice.set(this.orders().length ? '' : 'El servidor no ha devuelto pedidos para esta cuenta.');
      },
      error: error => {
        this.notice.set(error?.error?.message || 'No se pudieron cargar los pedidos. Comprueba la conexión e inténtalo de nuevo.');
        this.loading.set(false);
      }
    });
  }

  setStatus(order: Order, event: Event): void {
    const status = (event.target as HTMLSelectElement).value;
    this.basketService.updateOrderStatus(order.id, status).subscribe({
      next: () => {
        this.orders.update(orders => orders.map(item => item.id === order.id ? { ...item, status } : item));
        this.notice.set(`El pedido #${order.id} se ha actualizado.`);
      },
      error: () => { this.notice.set(`No se pudo actualizar el pedido #${order.id}.`); this.loadOrders(); }
    });
  }

  delete(order: Order): void {
    if (!window.confirm(`¿Eliminar el pedido #${order.id}? Esta acción no se puede deshacer.`)) return;
    this.basketService.deleteOrder(order.id).subscribe({
      next: () => {
        this.orders.update(orders => orders.filter(item => item.id !== order.id));
        this.page.update(page => Math.min(page, Math.max(1, Math.ceil(this.orders().length / this.pageSize))));
        this.notice.set(`El pedido #${order.id} se ha eliminado.`);
      },
      error: () => { this.notice.set(`No se pudo eliminar el pedido #${order.id}.`); }
    });
  }

  statusLabel(status: string): string {
    return ({ pending: 'Pendiente', processing: 'En preparación', completed: 'Completado', cancelled: 'Cancelado' } as Record<string, string>)[status] || status;
  }
}
