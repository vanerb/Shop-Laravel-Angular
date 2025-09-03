import {Component, SimpleChanges} from '@angular/core';
import {UtilitiesService} from '../../../services/utilities-service';
import {UsersService} from '../../../services/users-service';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../../../services/auth-service';
import {Header} from '../../../interfaces/header';
import {NgClass, NgForOf, NgIf} from '@angular/common';

@Component({
  selector: 'app-header-component',
  imports: [
    NgForOf,
    NgClass,
    NgIf
  ],
  templateUrl: './header-component.html',
  standalone: true,
  styleUrl: './header-component.css'
})
export class HeaderComponent {
  menu: Header[] = []
  selected: string = ""

  constructor(
    private readonly authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private readonly userService: UsersService,
    private readonly utilitiesService: UtilitiesService
  ) {

  }




  async ngOnInit() {
    if (this.authService.isLoggedIn()) {
      this.menu = [
        {
          key: "init",
          name: "Inicio",
          position: "left",
          action: async () => {
            await this.router.navigate(['/']);
            await this.selectionMenu();
          }
        },
        {
          key: "shop",
          name: "Tienda",
          position: "left",
          action: async () => {
            await this.router.navigate(['/shop']);
            await this.selectionMenu();
          }
        },

        {
          key: "basket",
          name: "Cesta",
          position: "right",
          action: async () => {
            await this.router.navigate(['/basket']);
            await this.selectionMenu();
          }
        },
        {
          key: "profile",
          name: "Mi perfil",
          position: "right",
          action: async () => {
            await this.router.navigate(['/my-panel']);
            await this.selectionMenu();
          },
          children: [
            {
              key: "my-panel",
              name: "Mi perfil",
              position: "right",
              action: async () => {
                await this.router.navigate(['/my-panel/']);
                await this.selectionMenu();
              }
            },
            {
              key: "my-panel",
              name: "Mis pedidos",
              position: "right",
              action: async () => {
                await this.router.navigate(['/my-orders/']);
                await this.selectionMenu();
              }
            },
            {
              key: "my-panel",
              name: "Administración",
              position: "right",
              action: async () => {
                await this.router.navigate(['/administration/']);
                await this.selectionMenu();
              }
            },
            {
              key: "logout",
              name: "Cerrar sesión",
              position: "right",
              action: async () => {
                this.authService.logout();
                await this.router.navigate(['/login']);
                await this.selectionMenu();
                window.location.reload()
              }
            }
          ]
        }
      ];
    }

    await this.selectionMenu()


  }

  getMenu(pos: string) {
    if (pos === "right") {
      return this.menu.filter(el => el.position === "right")
    } else {
      return this.menu.filter(el => el.position === "left")
    }

  }


  async selectionMenu() {
    await this.utilitiesService.sleep(0)
    let item = this.router.url.split("/")[1]

    console.log(item)
    switch (item) {
      case "inventory":
        this.selected = this.menu.find(el => el.key === "items")?.name ?? ""
        return

      case "init":
        this.selected = this.menu.find(el => el.key === "init")?.name ?? ""
        return
      case "contact":
        this.selected = this.menu.find(el => el.key === "contact")?.name ?? ""
        return
      case "profile":
        this.selected = this.menu.find(el => el.key === "profile")?.name ?? ""
        return
      case "my-panel":
        this.selected = this.menu.find(el => el.key === "profile")?.name ?? ""
        return
      case "":
        this.selected = this.menu.find(el => el.key === "init")?.name ?? ""
        return

      case "login":
        this.selected = this.menu.find(el => el.key === "login")?.name ?? ""
        return
      case "logout":
        this.selected = this.menu.find(el => el.key === "login")?.name ?? ""
        return

    }
  }

  async ngOnChanges(changes: SimpleChanges) {

  }
}
