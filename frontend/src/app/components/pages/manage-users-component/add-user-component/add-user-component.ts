import { Component, OnDestroy, signal } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-add-user-component',
  standalone: false,
  templateUrl: './add-user-component.html',
  styleUrl: './add-user-component.css'
})
export class AddUserComponent implements OnDestroy {


  form!:FormGroup
  confirm!: (result?: any) => void;
  close!: () => void;
  readonly selectedImage = signal<File | null>(null);
  readonly imagePreview = signal<string | null>(null);

  ngOnDestroy(): void {
    const preview = this.imagePreview();
    if (preview) URL.revokeObjectURL(preview);
  }

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      name: ['', [Validators.required]],
      subname: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      prefix: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      password: ['', [Validators.required]],
      type: ['user', [Validators.required]],
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

      const coverImage = this.selectedImage();
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
      const previous = this.imagePreview();
      if (previous) URL.revokeObjectURL(previous);
      this.selectedImage.set(file);
      this.imagePreview.set(URL.createObjectURL(file));
      this.form.get('profile_photo')?.setValue(file);
      input.value = '';
    }
  }

  removeImage(): void {
    const preview = this.imagePreview();
    if (preview) URL.revokeObjectURL(preview);
    this.imagePreview.set(null);
    this.selectedImage.set(null);
    this.form.get('profile_photo')?.setValue(null);
  }
}
