import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
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
export class ProfileComponent implements OnInit{
  formInformation!: FormGroup
  formPassword!: FormGroup
  user!:User
  selectedImagesCover: File[] = [];
  existingCoverImage: Images | null = null;
  deletedCoverImage: boolean = false;

  constructor( private authService: AuthService, private cd: ChangeDetectorRef,private fb: FormBuilder, private usersService: UsersService) {

    this.formInformation = this.fb.group({
      name: ['', [Validators.required]],
      subname: ['', [Validators.required]],
      email: ['', [Validators.required]],
      prefix: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      password: [''],
      type: ['', [Validators.required]],
      profile_photo: [null],
    });

    this.formPassword = this.fb.group({
      password: ['', [Validators.required]],
      repeatPassword: ['', [Validators.required]],
    });

  }

  ngOnInit() {
    this.authService.getUserByToken().subscribe({
      next: async (user:User) => {
       this.user = user;
        this.formInformation.patchValue({
          name: this.user?.name || '',
          subname: this.user.subname || '',
          email: this.user?.email || '',
          prefix: this.user?.prefix || '',
          phone: this.user?.phone || '',
          type: this.user?.type || ''
        });
       this.cd.detectChanges();
      },
      error: (err) => {

      }
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



  logout(){

    this.authService.logout()
  }

  getImageUrl(image: Images | undefined){
    return getImageUrl(image)
  }

  changePassword(){
    if( this.formPassword.get('password')?.value !== '' && this.formPassword.get('repeatPassword')?.value !== '' ){
      if( this.formPassword.get('password')?.value === this.formPassword.get('repeatPassword')?.value){
        const formData = new FormData();

        formData.append('password', this.formPassword.get('password')?.value);
        formData.append('repeatPassword', this.formPassword.get('repeatPassword')?.value);

        this.authService.changePassword(this.user.id, formData).subscribe({
          next: async () => {
            this.authService.getUserByToken().subscribe({
              next: async (user:User) => {
                this.user = user;
                this.cd.detectChanges();
              },
              error: (err) => {

              }
            });
          },
          error: (err) => {

          }
        });
      }
    }



  }

  update(){
    console.log("CLICLK", this.formInformation.value)
    if (this.formInformation.valid) {
      const formData = new FormData();

      formData.append('name', this.formInformation.get('name')?.value);
      formData.append('subname', this.formInformation.get('subname')?.value);
      formData.append('email', this.formInformation.get('email')?.value);
      formData.append('prefix', this.formInformation.get('prefix')?.value);
      formData.append('phone', this.formInformation.get('phone')?.value);
      formData.append('password', this.formInformation.get('password')?.value);
      formData.append('type', this.formInformation.get('type')?.value);

      if (this.selectedImagesCover.length > 0) {
        formData.append('profile_photo', this.selectedImagesCover[0], this.selectedImagesCover[0].name);
      }

      if (this.existingCoverImage) {
        formData.append('existing_profile_photo', this.existingCoverImage.id.toString());
      }

      if (this.deletedCoverImage) {
        formData.append('deleted_profile_photo', '1');
      }

      this.usersService.update(this.user.id, formData).subscribe({
        next: async () => {
          this.authService.getUserByToken().subscribe({
            next: async (user:User) => {
              this.user = user;
              this.cd.detectChanges();
            },
            error: (err) => {

            }
          });
        },
        error: (err) => {

        }
      });
    }
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

    this.update()
  }
}
