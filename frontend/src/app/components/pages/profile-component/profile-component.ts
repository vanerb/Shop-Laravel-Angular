import {Component, OnDestroy, OnInit, signal} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Images} from '../../../interfaces/products';
import {User} from '../../../interfaces/users';
import {AuthService} from '../../../services/auth-service';
import {UsersService} from '../../../services/users-service';
import {getImageUrl} from '../../../helpers/utilities.helper';

@Component({
  selector: 'app-profile-component',
  standalone: false,
  templateUrl: './profile-component.html',
  styleUrl: './profile-component.css'
})
export class ProfileComponent implements OnInit, OnDestroy{
  formInformation!: FormGroup
  formPassword!: FormGroup
  readonly user = signal<User | null>(null);
  readonly loading = signal(true);
  readonly loadError = signal('');
  readonly profileMessage = signal('');
  readonly profileError = signal('');
  readonly passwordMessage = signal('');
  readonly passwordError = signal('');
  readonly savingProfile = signal(false);
  readonly savingPassword = signal(false);
  readonly selectedImagesCover = signal<File[]>([]);
  readonly selectedCoverPreview = signal<string | null>(null);
  readonly existingCoverImage = signal<Images | null>(null);
  readonly deletedCoverImage = signal(false);

  ngOnDestroy(): void {
    const preview = this.selectedCoverPreview();
    if (preview) URL.revokeObjectURL(preview);
  }

  constructor( private authService: AuthService,private fb: FormBuilder, private usersService: UsersService) {

    this.formInformation = this.fb.group({
      name: ['', [Validators.required]],
      subname: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      prefix: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      password: [''],
      type: ['', [Validators.required]],
      profile_photo: [null],
    });

    this.formPassword = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      repeatPassword: ['', [Validators.required]],
    });

  }

  ngOnInit() {
    this.authService.getUserByToken().subscribe({
      next: async (user:User) => {
       this.user.set(user);
       this.loading.set(false);
       this.existingCoverImage.set(user.images?.find(image => image.from === 'profile_image') ?? null);
        this.formInformation.patchValue({
          name: user.name || '',
          subname: user.subname || '',
          email: user.email || '',
          prefix: user.prefix || '',
          phone: user.phone || '',
          type: user.type || ''
        });
      },
      error: (err) => {
        this.loading.set(false);
        this.loadError.set(err?.error?.message ?? 'No se pudieron cargar tus datos. Comprueba tu conexión e inténtalo de nuevo.');
      }
    });


  }



  logout(){

    this.authService.logout()
  }

  getImageUrl(image: Images | undefined){
    return getImageUrl(image)
  }

  changePassword(){
    this.passwordError.set('');
    this.passwordMessage.set('');
    if (this.formPassword.invalid) {
      this.formPassword.markAllAsTouched();
      this.passwordError.set('La contraseña debe tener al menos 6 caracteres.');
      return;
    }
    if (this.formPassword.value.password !== this.formPassword.value.repeatPassword) {
      this.passwordError.set('Las contraseñas no coinciden.');
      return;
    }
    const user = this.user();
    if (!user || this.savingPassword()) return;

    const formData = new FormData();
    formData.append('password', this.formPassword.value.password);
    formData.append('repeatPassword', this.formPassword.value.repeatPassword);
    this.savingPassword.set(true);
    this.authService.changePassword(user.id, formData).subscribe({
      next: () => {
        this.savingPassword.set(false);
        this.passwordMessage.set('Contraseña actualizada correctamente.');
        this.formPassword.reset();
      },
      error: err => {
        this.savingPassword.set(false);
        this.passwordError.set(this.validationMessage(err, 'No se pudo actualizar la contraseña.'));
      }
    });
  }

  update(){
    this.profileError.set('');
    this.profileMessage.set('');
    if (this.formInformation.invalid) {
      this.formInformation.markAllAsTouched();
      this.profileError.set('Revisa los datos del perfil e inténtalo de nuevo.');
      return;
    }
    const user = this.user();
    if (user && !this.savingProfile()) {
      const formData = new FormData();

      formData.append('name', this.formInformation.get('name')?.value);
      formData.append('subname', this.formInformation.get('subname')?.value);
      formData.append('email', this.formInformation.get('email')?.value);
      formData.append('prefix', this.formInformation.get('prefix')?.value);
      formData.append('phone', this.formInformation.get('phone')?.value);
      formData.append('password', this.formInformation.get('password')?.value);
      formData.append('type', this.formInformation.get('type')?.value);

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

      this.savingProfile.set(true);
      this.usersService.update(user.id, formData).subscribe({
        next: () => {
          this.savingProfile.set(false);
          this.profileMessage.set('Perfil actualizado correctamente.');
          this.authService.getUserByToken().subscribe({
            next: (user:User) => {
              this.user.set(user);
              this.existingCoverImage.set(user.images?.find(image => image.from === 'profile_image') ?? null);
              this.selectedImagesCover.set([]);
              const preview = this.selectedCoverPreview();
              if (preview) URL.revokeObjectURL(preview);
              this.selectedCoverPreview.set(null);
              this.deletedCoverImage.set(false);
            },
            error: err => {
              this.profileError.set(this.validationMessage(err, 'Los cambios se guardaron, pero no se pudo recargar el perfil.'));
            }
          });
        },
        error: err => {
          this.savingProfile.set(false);
          this.profileError.set(this.validationMessage(err, 'No se pudieron guardar los cambios.'));
        }
      });
    }
  }

  private validationMessage(error: any, fallback: string): string {
    const errors = error?.error?.errors as Record<string, string[]> | undefined;
    return errors ? Object.values(errors).flat().join(' ') : error?.error?.message ?? fallback;
  }



  onImageChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      const file = input.files[0];
      const preview = this.selectedCoverPreview();
      if (preview) URL.revokeObjectURL(preview);
      this.selectedImagesCover.set([file]);
      this.selectedCoverPreview.set(URL.createObjectURL(file));
      if (this.existingCoverImage()) {
        this.deletedCoverImage.set(true);
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
    this.deletedCoverImage.set(false);
    this.existingCoverImage.set(this.user()?.images?.find(image => image.from === 'profile_image') ?? null);
  }
}
