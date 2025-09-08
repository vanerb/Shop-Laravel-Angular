import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Category} from '../../../../interfaces/categories';

@Component({
  selector: 'app-edit-category-modal-component',
  standalone: false,
  templateUrl: './edit-category-modal-component.html',
  styleUrl: './edit-category-modal-component.css'
})
export class EditCategoryModalComponent implements OnInit{
  form!:FormGroup;
  category!: Category

  confirm!: (result?: any) => void;
  close!: () => void;


  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
    });
  }

  ngOnInit() {
    this.form.get('name')?.setValue(this.category.name)
    this.form.get('description')?.setValue(this.category.description)
  }


  update(){
    const formData = new FormData();

    formData.append('name', this.form.get('name')?.value);
    formData.append('description', this.form.get('description')?.value);
    this.confirm(formData)

  }
}
