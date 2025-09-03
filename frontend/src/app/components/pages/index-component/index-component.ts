import { Component } from '@angular/core';
import {ContainerComponent} from '../general/container-component/container-component';

@Component({
  selector: 'app-index-component',
  imports: [ContainerComponent],
  templateUrl: './index-component.html',
  standalone: true,
  styleUrl: './index-component.css'
})
export class IndexComponent {

}
