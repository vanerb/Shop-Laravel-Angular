import {Component, OnDestroy, OnInit, signal} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {User} from '../../../../interfaces/users';
import {Images} from '../../../../interfaces/products';
import { getImageUrl } from '../../../../helpers/utilities.helper';

@Component({
  selector: 'app-edit-user-component',
  standalone: false,
  templateUrl: './edit-user-component.html',
  styleUrl: './edit-user-component.css'
})
export class EditUserComponent implements OnInit, OnDestroy {

  form!:FormGroup
  user!: User
  confirm!: (result?: any) => void;
  close!: () => void;

  readonly selectedImagesCover = signal<File[]>([]);
  readonly existingCoverImage = signal<Images | null>(null);
  readonly deletedCoverImage = signal(false);
  readonly selectedCoverPreview = signal<string | null>(null);

  ngOnDestroy(): void {
    const preview = this.selectedCoverPreview();
    if (preview) URL.revokeObjectURL(preview);
  }

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      name: ['', [Validators.required]],
      subname: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      prefix: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      password: [''],
      type: ['', [Validators.required]],
      profile_photo: [null],
    });
  }

  ngOnInit() {

    this.form.patchValue({
      name: this.user?.name || '',
      subname: this.user?.subname || '',
      email: this.user?.email || '',
      prefix: this.user?.prefix || '',
      phone: this.user?.phone || '',
      type: this.user?.type || ''
    });

    // Separar imágenes existentes
    if (this.user?.images?.length) {
      for (const el of this.user.images) {
        if (el.from === 'profile_image') {
          this.existingCoverImage.set(el);
        }
      }
    }

  }

  update(){
    if (this.form.valid) {
      const formData = new FormData();

      formData.append('name', this.form.get('name')?.value);
      formData.append('subname', this.form.get('subname')?.value);
      formData.append('email', this.form.get('email')?.value);
      formData.append('prefix', this.form.get('prefix')?.value);
      formData.append('phone', this.form.get('phone')?.value);
      formData.append('password', this.form.get('password')?.value);
      formData.append('type', this.form.get('type')?.value);

      if (this.selectedImagesCover().length > 0) {
        formData.append('profile_photo', this.selectedImagesCover()[0], this.selectedImagesCover()[0].name);
      }

      if (this.existingCoverImage()) {
        formData.append('existing_profile_photo', this.existingCoverImage()!.id.toString());
      }

      if (this.deletedCoverImage()) {
        formData.append('deleted_profile_photo', '1');
      }

      this.confirm(formData)
    }
  }

  getImageUrl(item: Images | undefined): string {
    return getImageUrl(item)
  }

  onImageChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      const previous = this.selectedCoverPreview();
      if (previous) URL.revokeObjectURL(previous);
      this.selectedImagesCover.set([input.files[0]]); // reemplaza la anterior
      this.selectedCoverPreview.set(URL.createObjectURL(input.files[0]));
      if (this.existingCoverImage()) {
        this.deletedCoverImage.set(true); // marcar portada existente como borrada
        this.existingCoverImage.set(null);
      }
      input.value = '';
    }
  }

  removeSelectedImage(): void {
    const preview = this.selectedCoverPreview();
    if (preview) URL.revokeObjectURL(preview);
    this.selectedCoverPreview.set(null);
    this.selectedImagesCover.set([]);
  }
}
