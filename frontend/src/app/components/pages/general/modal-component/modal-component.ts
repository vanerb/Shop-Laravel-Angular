import {Component, ComponentRef, Inject, OnDestroy, signal, Type, ViewChild, ViewContainerRef} from '@angular/core';
import {DOCUMENT} from '@angular/common';

@Component({
  selector: 'app-modal-component',
  standalone: false,
  templateUrl: './modal-component.html',
  styleUrl: './modal-component.css'
})
export class ModalComponent implements OnDestroy {
  @ViewChild('modalContent', { read: ViewContainerRef, static: false })
  modalContent!: ViewContainerRef;

  readonly show = signal(false);
  readonly styles = signal<{ [key: string]: string }>({});
  private componentRef?: ComponentRef<any>;
  private previousScrollStyles?: {
    htmlOverflow: string;
    bodyOverflow: string;
    htmlOverscroll: string;
    bodyOverscroll: string;
  };

  constructor(@Inject(DOCUMENT) private readonly document: Document) {}

  open<T>(component: Type<T>, styles: { [key: string]: string } = {}, data: Partial<T> = {}) {
    this.lockPageScroll();
    this.styles.set(styles);
    this.show.set(true);

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (!this.modalContent) return;

        this.modalContent.clear();
        this.componentRef = this.modalContent.createComponent(component);

        // Inyectar datos
        Object.assign(this.componentRef.instance, data);

        // Inyectar funciones especiales al componente cargado
        (this.componentRef.instance as any).close = () => {
          this.close();
          reject(); // o resolve(false)
        };

        (this.componentRef.instance as any).confirm = (result?: any) => {
          this.close();
          resolve(result); // puede ser undefined, true, o datos
        };
      });
    });
  }

  close() {
    this.modalContent?.clear();
    this.show.set(false);
    this.restorePageScroll();
  }

  ngOnDestroy(): void {
    this.restorePageScroll();
  }

  private lockPageScroll(): void {
    if (this.previousScrollStyles) return;

    const html = this.document.documentElement;
    const body = this.document.body;
    this.previousScrollStyles = {
      htmlOverflow: html.style.overflow,
      bodyOverflow: body.style.overflow,
      htmlOverscroll: html.style.overscrollBehavior,
      bodyOverscroll: body.style.overscrollBehavior,
    };
    html.style.overflow = 'hidden';
    body.style.overflow = 'hidden';
    html.style.overscrollBehavior = 'none';
    body.style.overscrollBehavior = 'none';
  }

  private restorePageScroll(): void {
    if (!this.previousScrollStyles) return;

    const html = this.document.documentElement;
    const body = this.document.body;
    html.style.overflow = this.previousScrollStyles.htmlOverflow;
    body.style.overflow = this.previousScrollStyles.bodyOverflow;
    html.style.overscrollBehavior = this.previousScrollStyles.htmlOverscroll;
    body.style.overscrollBehavior = this.previousScrollStyles.bodyOverscroll;
    this.previousScrollStyles = undefined;
  }
}
