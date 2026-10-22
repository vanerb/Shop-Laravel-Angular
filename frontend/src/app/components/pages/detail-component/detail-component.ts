import { Component, signal } from '@angular/core';
import {Images, Product} from '../../../interfaces/products';
import { getImageUrl } from '../../../helpers/utilities.helper';

@Component({
  selector: 'app-detail-component',
  standalone: false,
  templateUrl: './detail-component.html',
  styleUrl: './detail-component.css'
})
export class DetailComponent {

  product!: Product
  readonly currentImageIndex = signal(0);

  confirm!: (result?: any) => void;
  close!: () => void;

  constructor() {
  }

  get carouselImages(): Images[] {
    const images = [...(this.product?.images ?? [])].sort((a, b) => a.id - b.id);
    const cover = images.find(image => image.from === 'cover');
    return cover ? [cover, ...images.filter(image => image.id !== cover.id)] : images;
  }

  get currentImage(): Images | undefined {
    return this.carouselImages[this.currentImageIndex()] ?? this.getCoverImage();
  }

  selectImage(index: number): void {
    if (index >= 0 && index < this.carouselImages.length) this.currentImageIndex.set(index);
  }

  previousImage(): void {
    const length = this.carouselImages.length;
    if (length > 1) this.currentImageIndex.update(index => (index - 1 + length) % length);
  }

  nextImage(): void {
    const length = this.carouselImages.length;
    if (length > 1) this.currentImageIndex.update(index => (index + 1) % length);
  }

  getImageUrl(item: Images | undefined): string {
    return getImageUrl(item)
  }

  getCoverImage(){
    return this.product?.images?.find(image => image.from === 'cover') ?? this.product?.images?.[0];
  }

  addProductBasket(item: Product | undefined){
    this.confirm(item)
  }
}
