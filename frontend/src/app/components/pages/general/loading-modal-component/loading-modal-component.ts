import { Component } from '@angular/core';
import { LoadingService } from '../../../../services/loading-service';

@Component({
  selector: 'app-loading-modal',
  standalone: false,
  templateUrl: './loading-modal-component.html',
  styleUrl: './loading-modal-component.css'
})
export class LoadingModalComponent {
  constructor(readonly loadingService: LoadingService) {}
}
