import { Component } from '@angular/core';
import {ContainerComponent} from '../general/container-component/container-component';

@Component({
  selector: 'app-admin-main-component',
  imports: [ContainerComponent],
  templateUrl: './admin-main-component.html',
  standalone: true,
  styleUrl: './admin-main-component.css'
})
export class AdminMainComponent {

}
