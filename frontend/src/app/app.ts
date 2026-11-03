import {Component, signal, ViewChild} from '@angular/core';
import {ModalComponent} from './components/pages/general/modal-component/modal-component';
import {ModalService} from './services/modal-service';
import {environment} from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: false,
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('frontend');
  protected readonly demo = environment.demo;

  @ViewChild('modal') modal!: ModalComponent;

  constructor(private modalService: ModalService) { }

  ngAfterViewInit() {
    this.modalService.register(this.modal);
  }
}
