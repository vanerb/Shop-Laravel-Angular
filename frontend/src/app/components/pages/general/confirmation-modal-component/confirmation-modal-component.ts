import { Component } from '@angular/core';

@Component({
  selector: 'app-confirmation-modal-component',
  standalone: false,
  templateUrl: './confirmation-modal-component.html',
  styleUrl: './confirmation-modal-component.css'
})
export class ConfirmationModalComponent {

  title: string = "";
  message: string="";
  confirm!: (result?: any) => void;
  close!: () => void;
}
