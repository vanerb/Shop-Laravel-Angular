import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {UtilitiesService} from '../../../services/utilities-service';
import {Order} from '../../../interfaces/order';
import {BasketService} from '../../../services/basket-service';

@Component({
  selector: 'app-orders-component',
  standalone: false,
  templateUrl: './orders-component.html',
  styleUrl: './orders-component.css'
})
export class OrdersComponent implements OnInit{
  orders: Order[] = []

  constructor(private basketService: BasketService, private cd: ChangeDetectorRef, private readonly utilitiesService: UtilitiesService) {}

  ngOnInit() {
    this.basketService.getAllOrderByUser().subscribe({
      next: (orders: Order[]) => {
        this.orders = [...orders]; // forzar nueva referencia
        console.log("PRODUCTOS RECIBIDOS", this.orders);
        this.cd.detectChanges();
      },
      error: err => console.error("Error al cargar productos", err)
    });
  }
}
