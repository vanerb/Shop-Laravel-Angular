import {Component, computed, OnInit, signal} from '@angular/core';
import {User} from '../../../interfaces/users';
import {UsersService} from '../../../services/users-service';
import {ModalService} from '../../../services/modal-service';
import {AddUserComponent} from './add-user-component/add-user-component';
import {EditUserComponent} from './edit-user-component/edit-user-component';
import {ConfirmationModalComponent} from '../general/confirmation-modal-component/confirmation-modal-component';
import {getImageUrl, transformDate} from '../../../helpers/utilities.helper';

@Component({
  selector: 'app-manage-users-component',
  standalone: false,
  templateUrl: './manage-users-component.html',
  styleUrl: './manage-users-component.css'
})
export class ManageUsersComponent implements OnInit {

  readonly users = signal<User[]>([]);
  readonly notice = signal('');
  readonly page = signal(1);
  readonly pageSize = 12;
  readonly paginatedUsers = computed(() => {
    const start = (this.page() - 1) * this.pageSize;
    return this.users().slice(start, start + this.pageSize);
  });

  constructor( private readonly usersService: UsersService, private readonly modalService: ModalService) {
  }

  ngOnInit() {
    this.loadUsers();
  }

  private loadUsers(): void {
    this.usersService.getAllUsers().subscribe({
      next: (users: User[]) => {
        this.users.set(users);
        this.page.set(1);
        this.notice.set('');
      },
      error: () => { this.notice.set('No se pudieron cargar los usuarios. Inténtalo de nuevo.'); }
    });
  }

  update(user: User){
    this.modalService.open(EditUserComponent, {
        width: '90%',

      },
      { user: user }).then(async (item: FormData) => {


      this.usersService.update(user.id, item).subscribe({
        next: async () => {
          this.notice.set('Usuario actualizado correctamente.');
          this.loadUsers();
        },
        error: () => { this.notice.set('No se pudo actualizar el usuario. Revisa los datos e inténtalo de nuevo.'); }
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
          this.users.update(users => users.filter(item => item.id !== user.id));
          this.page.update(page => Math.min(page, Math.max(1, Math.ceil(this.users().length / this.pageSize))));
          this.notice.set('Usuario eliminado correctamente.');
        },
        error: () => { this.notice.set('No se pudo eliminar el usuario.'); }
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

      this.usersService.create(item).subscribe({
        next: async () => {
          this.notice.set('Usuario creado correctamente.');
          this.loadUsers();
        },
        error: () => { this.notice.set('No se pudo crear el usuario. Comprueba el correo y los datos del formulario.'); }
      });


    })
      .catch(() => {
        this.modalService.close()
      });
  }

  getImageUrl(item: User | undefined): string {
   return getImageUrl(item?.images?.[0])
  }

  getDates(date: string){
    return transformDate(date)
  }
}
