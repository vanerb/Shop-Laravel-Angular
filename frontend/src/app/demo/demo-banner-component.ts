import { Component, signal } from '@angular/core';
import { DEMO_ACCOUNTS, DEMO_PASSWORD, resetDemoData } from './shop-demo.interceptor';

/** Aviso fijo de la demo estática con las cuentas de prueba y un botón para restablecer los datos. */
@Component({
  selector: 'app-demo-banner',
  standalone: false,
  template: `
    <aside class="demo-banner" [class.closed]="closed()">
      @if (closed()) {
        <button type="button" class="pill" (click)="closed.set(false)">Demo · cuentas de prueba</button>
      } @else {
        <strong>Demo sin servidor</strong>
        <span>
          Los datos se guardan en tu navegador.
          @for (account of accounts; track account.email) {
            {{ $first ? 'Entra como' : 'o como' }} {{ account.role }} con <code>{{ account.email }}</code>
          }
          y la contraseña <code>{{ password }}</code>.
        </span>
        <button type="button" (click)="reset()">Restablecer datos</button>
        <button type="button" class="close" aria-label="Ocultar aviso de demo" (click)="closed.set(true)">×</button>
      }
    </aside>
  `,
  styles: `
    .demo-banner{position:fixed;left:50%;bottom:16px;transform:translateX(-50%);z-index:1000;display:flex;align-items:center;gap:12px;width:min(920px,calc(100% - 32px));box-sizing:border-box;padding:10px 12px 10px 16px;border:1px solid #1d1b2e;border-radius:16px;background:#e4f86b;color:#1d1b2e;font-size:12px;line-height:1.45;box-shadow:0 12px 32px #1d1b2e33}
    .demo-banner.closed{left:auto;right:16px;transform:none;width:auto;padding:0;border:0;background:none;box-shadow:none}
    strong{white-space:nowrap;font-weight:800}
    span{flex:1}
    code{padding:1px 5px;border-radius:6px;background:#ffffffb3;font-size:11px}
    button{border:1px solid #1d1b2e;border-radius:99px;background:#fff;color:#1d1b2e;padding:6px 11px;font:inherit;font-size:11px;font-weight:700;white-space:nowrap;cursor:pointer}
    .close{border:0;background:none;font-size:18px;line-height:1;padding:2px 6px}
    .pill{background:#e4f86b;box-shadow:0 8px 20px #1d1b2e33}
    @media(max-width:640px){.demo-banner:not(.closed){flex-wrap:wrap;gap:8px}span{flex-basis:100%;order:2}.close{margin-left:auto}}
  `
})
export class DemoBannerComponent {
  readonly accounts = DEMO_ACCOUNTS;
  readonly password = DEMO_PASSWORD;
  readonly closed = signal(false);

  reset(): void {
    resetDemoData();
    location.hash = '#/shop';
    location.reload();
  }
}
