import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {User} from '../../../../interfaces/users';
import {Images} from '../../../../interfaces/products';
import {UtilitiesService} from '../../../../services/utilities-service';

@Component({
  selector: 'app-edit-user-component',
  standalone: false,
  templateUrl: './edit-user-component.html',
  styleUrl: './edit-user-component.css'
})
export class EditUserComponent implements OnInit {

  form!:FormGroup
  user!: User
  confirm!: (result?: any) => void;
  close!: () => void;

  selectedImagesCover: File[] = [];
  existingCoverImage: Images | null = null;
  deletedCoverImage: boolean = false;

  constructor(private fb: FormBuilder, private utilities: UtilitiesService) {
    this.form = this.fb.group({
      name: ['', [Validators.required]],
      subname: ['', [Validators.required]],
      email: ['', [Validators.required]],
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
      subname: this.user.subname || '',
      email: this.user?.email || '',
      prefix: this.user?.prefix || '',
      phone: this.user?.phone || '',
      type: this.user?.type || ''
    });

    // Separar imágenes existentes
    if (this.user?.images?.length) {
      for (const el of this.user.images) {
        if (el.from === 'profile_image') {
          this.existingCoverImage = el;
        }
      }
    }

  }

  update(){
    console.log("CLICLK", this.form.value)
    if (this.form.valid) {
      const formData = new FormData();

      formData.append('name', this.form.get('name')?.value);
      formData.append('subname', this.form.get('subname')?.value);
      formData.append('email', this.form.get('email')?.value);
      formData.append('prefix', this.form.get('prefix')?.value);
      formData.append('phone', this.form.get('phone')?.value);
      formData.append('password', this.form.get('password')?.value);
      formData.append('type', this.form.get('type')?.value);

      if (this.selectedImagesCover.length > 0) {
        formData.append('profile_photo', this.selectedImagesCover[0], this.selectedImagesCover[0].name);
      }

      if (this.existingCoverImage) {
        formData.append('existing_profile_photo', this.existingCoverImage.id.toString());
      }

      if (this.deletedCoverImage) {
        formData.append('deleted_profile_photo', '1');
      }

      this.confirm(formData)
    }
  }

  getImageUrl(item: Images | undefined): string {
    return this.utilities.getImageUrl(item)
  }

  onImageChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.selectedImagesCover = [input.files[0]]; // reemplaza la anterior
      if (this.existingCoverImage) {
        this.deletedCoverImage = true; // marcar portada existente como borrada
        this.existingCoverImage = null;
      }
    }
  }
}
