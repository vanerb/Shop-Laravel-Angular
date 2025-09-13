import { Component } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-add-user-component',
  standalone: false,
  templateUrl: './add-user-component.html',
  styleUrl: './add-user-component.css'
})
export class AddUserComponent {


  form!:FormGroup
  confirm!: (result?: any) => void;
  close!: () => void;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      name: ['', [Validators.required]],
      subname: ['', [Validators.required]],
      email: ['', [Validators.required]],
      prefix: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      password: ['', [Validators.required]],
      type: ['', [Validators.required]],
      profile_photo: [null],
    });
  }


  create(){
    if (this.form.valid) {
      const formData = new FormData();

      formData.append('name', this.form.get('name')?.value);
      formData.append('subname', this.form.get('subname')?.value);
      formData.append('email', this.form.get('email')?.value);
      formData.append('prefix', this.form.get('prefix')?.value);
      formData.append('phone', this.form.get('phone')?.value);
      formData.append('password', this.form.get('password')?.value);
      formData.append('type', this.form.get('type')?.value);

      const coverImage = this.form.get('profile_photo')?.value;
      if (coverImage) {
        formData.append('profile_photo', coverImage);
      }

      this.confirm(formData)
    }
  }

  onImageChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) {
      this.form.get('profile_photo')?.setValue(file);
    }
  }
}
