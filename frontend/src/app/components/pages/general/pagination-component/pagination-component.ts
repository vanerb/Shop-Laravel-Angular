import { Component, computed, input, output } from '@angular/core';

@Component({
  selector: 'app-pagination',
  standalone: false,
  templateUrl: './pagination-component.html',
  styleUrl: './pagination-component.css'
})
export class PaginationComponent {
  readonly totalItems = input(0);
  readonly pageSize = input(12);
  readonly currentPage = input(1);
  readonly pageChange = output<number>();

  readonly pageCount = computed(() => Math.max(1, Math.ceil(this.totalItems() / Math.max(1, this.pageSize()))));
  readonly pageNumbers = computed(() => {
    const count = this.pageCount();
    const current = Math.min(this.currentPage(), count);
    const start = Math.max(1, Math.min(current - 2, count - 4));
    return Array.from({ length: Math.min(5, count) }, (_, index) => start + index);
  });
  readonly firstItem = computed(() => this.totalItems() ? (this.currentPage() - 1) * this.pageSize() + 1 : 0);
  readonly lastItem = computed(() => Math.min(this.currentPage() * this.pageSize(), this.totalItems()));

  goTo(page: number): void {
    const nextPage = Math.max(1, Math.min(page, this.pageCount()));
    if (nextPage !== this.currentPage()) this.pageChange.emit(nextPage);
  }
}
