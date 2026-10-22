import {Component, signal} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../../services/auth-service';
import {Router} from '@angular/router';
import {getImageUrl} from '../../../helpers/utilities.helper';
import {Images} from '../../../interfaces/products';

@Component({
  selector: 'app-register-component',
  standalone: false,
  templateUrl: './register-component.html',
  styleUrl: './register-component.css'
})
export class RegisterComponent {

  form!:FormGroup

  readonly selectedImagesCover = signal<File[]>([]);
  readonly existingCoverImage = signal<Images | null>(null);
  readonly deletedCoverImage = signal(false);
  readonly previewCoverImage = signal<string | null>(null);
  readonly registerError = signal('');
  readonly submitting = signal(false);

  constructor(private  readonly  authService: AuthService, private router: Router,private fb: FormBuilder) {
    this.form = this.fb.group({
      name: ['', [Validators.required]],
      subname: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      prefix: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      repeatPassword: ['',[Validators.required]],
      type: ['user'],
      profile_photo: [null],
    });
  }

  async onImageChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.selectedImagesCover.set([input.files[0]]);
      if (this.existingCoverImage()) {
        this.deletedCoverImage.set(true);
        this.existingCoverImage.set(null);
      }
    }

    // Generar vista previa
    const reader = new FileReader();
    reader.onload = () => {
      this.previewCoverImage.set(reader.result as string);
    };
    const file = this.selectedImagesCover()[0];
    if (file) reader.readAsDataURL(file);


  }

  removeProfilePhoto(): void {
    this.selectedImagesCover.set([]);
    this.previewCoverImage.set(null);
    this.form.get('profile_photo')?.setValue(null);
  }

  register(){
    this.registerError.set('');
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.registerError.set('Completa todos los campos obligatorios con datos válidos.');
      return;
    }

    if (this.form.get('password')?.value !== this.form.get('repeatPassword')?.value) {
      this.registerError.set('Las contraseñas no coinciden.');
      return;
    }

          const formData = new FormData();

          formData.append('name', this.form.get('name')?.value);
          formData.append('subname', this.form.get('subname')?.value);
          formData.append('email', this.form.get('email')?.value);
          formData.append('prefix', this.form.get('prefix')?.value);
          formData.append('phone', this.form.get('phone')?.value);
          formData.append('password', this.form.get('password')?.value);
          formData.append('type', 'user');

        if (this.selectedImagesCover().length > 0) {
          formData.append('profile_photo', this.selectedImagesCover()[0], this.selectedImagesCover()[0].name);
        }

        const existingCover = this.existingCoverImage();
        if (existingCover) {
          formData.append('existing_profile_photo', existingCover.id.toString());
        }

        if (this.deletedCoverImage()) {
          formData.append('deleted_profile_photo', '1');
        }

          this.submitting.set(true);
          this.authService.register(formData).subscribe({
            next: async () => {
              await this.router.navigate(['/login']);
            },
            error: (err) => {
              this.submitting.set(false);
              const validationErrors = err?.error?.errors as Record<string, string[]> | undefined;
              this.registerError.set(validationErrors
                ? Object.values(validationErrors).flat().join(' ')
                : err?.error?.message ?? 'No se pudo crear la cuenta. Comprueba los datos e inténtalo de nuevo.');
            }
          });

  }

  protected readonly getImageUrl = getImageUrl;
}
