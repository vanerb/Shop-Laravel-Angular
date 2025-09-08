import { Component } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-add-category-modal-component',
  standalone: false,
  templateUrl: './add-category-modal-component.html',
  styleUrl: './add-category-modal-component.css'
})
export class AddCategoryModalComponent {

  form!:FormGroup;

  confirm!: (result?: any) => void;
  close!: () => void;


  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
    });
  }


  create(){
    const formData = new FormData();

    formData.append('name', this.form.get('name')?.value);
    formData.append('description', this.form.get('description')?.value);
    this.confirm(formData)

  }




}
