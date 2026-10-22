import {AfterViewInit, Component, OnDestroy, OnInit, signal} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Category} from '../../../../interfaces/categories';
import {CategoriesService} from '../../../../services/categories-service';
import {Images, Product} from '../../../../interfaces/products';
import { getImageUrl } from '../../../../helpers/utilities.helper';

@Component({
  selector: 'app-edit-product-modal-component',
  standalone: false,
  templateUrl: './edit-product-modal-component.html',
  styleUrl: './edit-product-modal-component.css'
})
export class EditProductModalComponent implements OnInit, AfterViewInit, OnDestroy{
  form!: FormGroup;
  product!: Product;

  readonly categories = signal<Category[]>([]);

  // Archivos nuevos seleccionados
  readonly selectedImagesGallery = signal<File[]>([]);
  readonly selectedImagesCover = signal<File[]>([]);
  readonly selectedCoverPreview = signal<string | null>(null);
  readonly galleryPreviews = signal<{ file: File; url: string }[]>([]);

  // Imágenes existentes
  readonly existingGalleryImages = signal<Images[]>([]);
  readonly existingCoverImage = signal<Images | null>(null);

  // Imágenes eliminadas
  readonly deletedGalleryImages = signal<Images[]>([]);
  readonly deletedCoverImage = signal(false);

  confirm!: (result?: any) => void;
  close!: () => void;

  ngOnDestroy(): void {
    const cover = this.selectedCoverPreview();
    if (cover) URL.revokeObjectURL(cover);
    this.galleryPreviews().forEach(preview => URL.revokeObjectURL(preview.url));
  }

  constructor(
    private fb: FormBuilder,
    private readonly categoriesService: CategoriesService,
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      price: ['', Validators.required],
      category_id: ['', Validators.required],
      cover_image: [null],
      images: [null],
    });
  }

  async ngOnInit() {
    // Set form values
    this.form.patchValue({
      name: this.product?.name || '',
      description: this.product?.description || '',
      price: this.product?.price || '',
      category_id: this.product?.category_id || ''
    });

    // Separar imágenes existentes
    if (this.product?.images?.length) {
      for (const el of [...this.product.images].sort((a, b) => a.id - b.id)) {
        if (el.from === 'gallery') {
          this.existingGalleryImages.update(images => [...images, el]);
        } else if (el.from === 'cover') {
          this.existingCoverImage.set(el);
        }
      }
    }
  }

  ngAfterViewInit() {
    this.categoriesService.getAllCategoriesByUser().subscribe({
      next: (categories: Category[]) => {
        this.categories.set(categories);
      },
      error: (err) => console.error("Error al cargar categorías", err)
    });
  }

  onCoverImageChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      const previousPreview = this.selectedCoverPreview();
      if (previousPreview) URL.revokeObjectURL(previousPreview);
      this.selectedImagesCover.set([input.files[0]]); // reemplaza la anterior
      this.selectedCoverPreview.set(URL.createObjectURL(input.files[0]));
      if (this.existingCoverImage()) {
        this.deletedCoverImage.set(true); // marcar portada existente como borrada
        this.existingCoverImage.set(null);
      }
      input.value = '';
    }
  }

  onGalleryImagesChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      const addedFiles = Array.from(input.files);
      this.selectedImagesGallery.update(images => [...images, ...addedFiles]);
      this.galleryPreviews.update(previews => [...previews, ...addedFiles.map(file => ({ file, url: URL.createObjectURL(file) }))]);
      input.value = '';
    }
  }

  getImageUrl(image: Images): string {
    return getImageUrl(image)
  }

  removeExistingGallery(image: Images): void {
    this.deletedGalleryImages.update(images => [...images, image]);
    this.existingGalleryImages.update(images => images.filter(item => item.id !== image.id));
  }

  removeExistingCover(): void {
    if (!this.existingCoverImage()) return;
    this.deletedCoverImage.set(true);
    this.existingCoverImage.set(null);
  }

  removeSelectedCover(): void {
    const preview = this.selectedCoverPreview();
    if (preview) URL.revokeObjectURL(preview);
    this.selectedCoverPreview.set(null);
    this.selectedImagesCover.set([]);
  }

  removeSelectedGallery(file: File): void {
    this.galleryPreviews.update(previews => {
      const preview = previews.find(item => item.file === file);
      if (preview) URL.revokeObjectURL(preview.url);
      return previews.filter(item => item.file !== file);
    });
    this.selectedImagesGallery.update(images => images.filter(image => image !== file));
  }

  async urlToFile(url: string, filename: string, mimeType: string): Promise<File> {
    const response = await fetch(url);
    const blob = await response.blob();
    return new File([blob], filename, { type: mimeType });
  }

  update() {
    if (!this.form.valid) return;

    const formData = new FormData();
    formData.append('name', this.form.get('name')?.value);
    formData.append('description', this.form.get('description')?.value);
    formData.append('price', this.form.get('price')?.value);
    formData.append('category_id', this.form.get('category_id')?.value);

    // Subir nueva portada
    if (this.selectedImagesCover().length > 0) {
      formData.append('cover_image', this.selectedImagesCover()[0], this.selectedImagesCover()[0].name);
    }

    // Subir nuevas imágenes de galería
    this.selectedImagesGallery().forEach(img => formData.append('images[]', img));

    // IDs de imágenes existentes que se mantienen
    this.existingGalleryImages().forEach(img => formData.append('existing_images[]', img.id.toString()));
    if (this.existingCoverImage()) {
      formData.append('existing_cover_image', this.existingCoverImage()!.id.toString());
    }

    // Imágenes eliminadas
    this.deletedGalleryImages().forEach(img => formData.append('deleted_images[]', img.id.toString()));
    if (this.deletedCoverImage()) {
      formData.append('deleted_cover_image', '1');
    }

    this.confirm(formData);
  }
}
