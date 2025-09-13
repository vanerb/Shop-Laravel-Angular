import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {User} from '../../../interfaces/users';
import {Product} from '../../../interfaces/products';
import {UtilitiesService} from '../../../services/utilities-service';
import {UsersService} from '../../../services/users-service';
import {
  AddProductModalComponent
} from '../manage-products-component/add-product-modal-component/add-product-modal-component';
import {ModalService} from '../../../services/modal-service';
import {AuthService} from '../../../services/auth-service';
import {AddUserComponent} from './add-user-component/add-user-component';
import {EditUserComponent} from './edit-user-component/edit-user-component';
import {ConfirmationModalComponent} from '../general/confirmation-modal-component/confirmation-modal-component';

@Component({
  selector: 'app-manage-users-component',
  standalone: false,
  templateUrl: './manage-users-component.html',
  styleUrl: './manage-users-component.css'
})
export class ManageUsersComponent implements OnInit {

  users: User[] = []

  constructor(private  readonly utilitiesService: UtilitiesService, private readonly usersService: UsersService,private cd: ChangeDetectorRef, private readonly modalService: ModalService, private readonly authService: AuthService) {
  }

  ngOnInit() {
    this.usersService.getAllUsers().subscribe({
      next: async (users: User[]) => {
        this.users = users
        this.cd.detectChanges();
      },
      error: err => console.error("Error al cargar productos", err)
    });
  }

  update(user: User){
    this.modalService.open(EditUserComponent, {
        width: '90%',

      },
      { user: user }).then(async (item: FormData) => {


      console.log("CLIKC")

      this.usersService.update(user.id, item).subscribe({
        next: async () => {
          this.usersService.getAllUsers().subscribe({
            next: async (users: User[]) => {
              this.users = users
              this.cd.detectChanges();
            },
            error: err => console.error("Error al cargar productos", err)
          });
        },
        error: (err) => {

        }
      });


    })
      .catch(() => {
        this.modalService.close()
      });
  }

  delete(user:User){
    this.modalService.open(ConfirmationModalComponent, {
        width: '90%',

      },
      { title: 'Eliminar', message: '¿Está seguro de que quiere eliminar el elemento '+user.email+"?" }).then(async (item: FormData) => {
      this.usersService.delete(user.id).subscribe({
        next: () => {
          this.usersService.getAllUsers().subscribe({
            next: async (users: User[]) => {
              this.users = users
              this.cd.detectChanges();
            },
            error: err => console.error("Error al cargar productos", err)
          });
        },
        error: (err) => {

        }
      });
    })
      .catch(() => {
        this.modalService.close()
      });
  }

  add(){
    this.modalService.open(AddUserComponent, {
        width: '90%',

      },
      {}).then(async (item: FormData) => {

      this.authService.register(item).subscribe({
        next: async () => {
          this.usersService.getAllUsers().subscribe({
            next: async (users: User[]) => {
              this.users = users
              this.cd.detectChanges();
            },
            error: err => console.error("Error al cargar productos", err)
          });
        },
        error: (err) => {

        }
      });


    })
      .catch(() => {
        this.modalService.close()
      });
  }

  getImageUrl(item: User | undefined): string {
    if (!item || !item.images || item.images.length === 0) {
      return 'http://localhost:8000/storage/general/no_image.jpg';
    }
    return `http://localhost:8000/storage/${item.images[0].path}`;
  }

  getDates(date: string){
    return this.utilitiesService.transformDate(date)
  }
}
