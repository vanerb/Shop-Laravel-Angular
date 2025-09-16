import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
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
  orders: Order[] = []
  type: string | null | false = false

  constructor(private basketService: BasketService, private cd: ChangeDetectorRef, private authService: AuthService) {}

  ngOnInit() {
    this.type = this.authService.getType()

    if(this.type === 'admin'){
      this.basketService.getAllOrder().subscribe({
        next: (orders: Order[]) => {
          this.orders = [...orders]; // forzar nueva referencia
          console.log("PRODUCTOS RECIBIDOS", this.orders);
          this.cd.detectChanges();
        },
        error: err => console.error("Error al cargar productos", err)
      });
    }
    else{
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
}
