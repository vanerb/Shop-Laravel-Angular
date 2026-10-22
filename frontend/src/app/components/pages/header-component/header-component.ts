import { Component, ElementRef, HostListener, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth-service';

@Component({
  selector: 'app-header-component',
  standalone: false,
  templateUrl: './header-component.html',
  styleUrl: './header-component.css'
})
export class HeaderComponent implements OnInit {
  readonly type = signal<string | false | null>(null);
  readonly isLoggedIn = signal(false);
  readonly menuOpen = signal(false);
  readonly accountMenuOpen = signal(false);

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly elementRef: ElementRef<HTMLElement>,
  ) {}

  ngOnInit(): void {
    this.isLoggedIn.set(this.authService.isLoggedIn());
    this.type.set(this.authService.getType());
    if (!this.isLoggedIn()) return;

    this.authService.getUserByToken().subscribe({
      next: user => {
        this.type.set(user.type);
        this.authService.setType(user.type);
      },
      error: () => this.type.set(null)
    });
  }

  toggleMenu(): void { this.menuOpen.update(open => !open); }

  toggleAccountMenu(): void { this.accountMenuOpen.update(open => !open); }

  closeMenus(): void {
    this.menuOpen.set(false);
    this.accountMenuOpen.set(false);
  }

  logout(): void {
    this.authService.logout();
    this.isLoggedIn.set(false);
    this.type.set(null);
    this.closeMenus();
  }

  @HostListener('document:click', ['$event'])
  closeAccountMenuOnOutsideClick(event: MouseEvent): void {
    if (!this.elementRef.nativeElement.contains(event.target as Node)) this.accountMenuOpen.set(false);
  }

  @HostListener('document:keydown.escape')
  closeAccountMenuOnEscape(): void { this.closeMenus(); }
}
