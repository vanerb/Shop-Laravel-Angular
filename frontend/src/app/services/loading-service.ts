import { computed, Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LoadingService {
  private readonly activeRequests = signal(0);
  private readonly visible = signal(false);
  private showTimer?: ReturnType<typeof setTimeout>;

  readonly isLoading = computed(() => this.visible());

  beginRequest(): () => void {
    this.activeRequests.update(count => count + 1);
    if (this.activeRequests() === 1) {
      this.showTimer = setTimeout(() => this.visible.set(true), 180);
    }

    let finished = false;
    return () => {
      if (finished) return;
      finished = true;
      this.activeRequests.update(count => Math.max(0, count - 1));
      if (this.activeRequests() === 0) {
        if (this.showTimer) clearTimeout(this.showTimer);
        this.showTimer = undefined;
        this.visible.set(false);
      }
    };
  }
}
