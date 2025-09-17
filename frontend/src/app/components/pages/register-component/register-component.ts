import {ChangeDetectorRef, Component} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {User} from '../../../interfaces/users';
import {AuthService} from '../../../services/auth-service';
import {Router} from '@angular/router';
import {getImageUrl, sleep} from '../../../helpers/utilities.helper';
import {Images} from '../../../interfaces/products';

@Component({
  selector: 'app-register-component',
  standalone: false,
  templateUrl: './register-component.html',
  styleUrl: './register-component.css'
})
export class RegisterComponent {

  form!:FormGroup

  selectedImagesCover: File[] = [];
  existingCoverImage: Images | null = null;
  deletedCoverImage: boolean = false;
  previewCoverImage!: string;

  constructor(private  readonly  authService: AuthService, private router: Router,private fb: FormBuilder, private  cd: ChangeDetectorRef) {
    this.form = this.fb.group({
      name: ['', [Validators.required]],
      subname: ['', [Validators.required]],
      email: ['', [Validators.required]],
      prefix: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      password: ['',[Validators.required]],
      repeatPassword: ['',[Validators.required]],
      type: ['', [Validators.required]],
      profile_photo: [null],
    });
  }

  async onImageChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.selectedImagesCover = [input.files[0]]; // reemplaza la anterior
      if (this.existingCoverImage) {
        this.deletedCoverImage = true; // marcar portada existente como borrada
        this.existingCoverImage = null;
      }
    }

    // Generar vista previa
    const reader = new FileReader();
    reader.onload = () => {
      this.previewCoverImage = reader.result as string; // base64
    };
    reader.readAsDataURL(this.selectedImagesCover[0]);

    await sleep(1000)
    this.cd.detectChanges()


  }

  register(){

    if( this.form.get('password')?.value !== '' && this.form.get('repeatPassword')?.value !== '' ){
      if( this.form.get('password')?.value === this.form.get('repeatPassword')?.value) {

          const formData = new FormData();

          formData.append('name', this.form.get('name')?.value);
          formData.append('subname', this.form.get('subname')?.value);
          formData.append('email', this.form.get('email')?.value);
          formData.append('prefix', this.form.get('prefix')?.value);
          formData.append('phone', this.form.get('phone')?.value);
          formData.append('password', this.form.get('password')?.value);
          formData.append('type', 'user');

        if (this.selectedImagesCover.length > 0) {
          formData.append('profile_photo', this.selectedImagesCover[0], this.selectedImagesCover[0].name);
        }

        if (this.existingCoverImage) {
          formData.append('existing_profile_photo', this.existingCoverImage.id.toString());
        }

        if (this.deletedCoverImage) {
          formData.append('deleted_profile_photo', '1');
        }

          this.authService.register(formData).subscribe({
            next: async () => {
              this.authService.logout()
            },
            error: (err) => {

            }
          });

      }
      }

  }

  protected readonly getImageUrl = getImageUrl;
}
