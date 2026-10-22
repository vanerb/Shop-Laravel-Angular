import {Component, OnDestroy, signal} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Category} from '../../../../interfaces/categories';
import {CategoriesService} from '../../../../services/categories-service';

@Component({
  selector: 'app-add-product-modal-component',
  standalone: false,
  templateUrl: './add-product-modal-component.html',
  styleUrl: './add-product-modal-component.css'
})
export class AddProductModalComponent implements OnDestroy {

  form!: FormGroup;

  readonly categories = signal<Category[]>([]);
  readonly coverPreview = signal<{ file: File; url: string } | null>(null);
  readonly galleryPreviews = signal<{ file: File; url: string }[]>([]);

  confirm!: (result?: any) => void;
  close!: () => void;

  ngOnDestroy(): void {
    const cover = this.coverPreview();
    if (cover) URL.revokeObjectURL(cover.url);
    this.galleryPreviews().forEach(preview => URL.revokeObjectURL(preview.url));
  }

  constructor(private fb: FormBuilder, private readonly categoriesService: CategoriesService) {

    this.form = this.fb.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      price: ['', [Validators.required]],
      category_id: ['', [Validators.required]],
      cover_image: [null],
      images: [null],
    });


  }

  ngOnInit() {
    this.categoriesService.getAllCategoriesByUser().subscribe({
      next: (categories: Category[]) => {
        this.categories.set(categories);
      },
      error: (err) => console.error("Error al cargar productos", err)
    });
  }

  onCoverImageChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) {
      this.form.get('cover_image')?.setValue(file);
      const previous = this.coverPreview();
      if (previous) URL.revokeObjectURL(previous.url);
      this.coverPreview.set({ file, url: URL.createObjectURL(file) });
    }
  }

  onGalleryImagesChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const files = input.files;
    if (files && files.length > 0) {
      const fileArray = Array.from(files);
      this.galleryPreviews.update(previews => [...previews, ...fileArray.map(file => ({ file, url: URL.createObjectURL(file) }))]);
      this.form.get('images')?.setValue(this.galleryPreviews().map(preview => preview.file));
      input.value = '';
    }
  }

  removeCoverPreview(): void {
    const preview = this.coverPreview();
    if (preview) URL.revokeObjectURL(preview.url);
    this.coverPreview.set(null);
    this.form.get('cover_image')?.setValue(null);
  }

  removeGalleryPreview(file: File): void {
    this.galleryPreviews.update(previews => {
      const removed = previews.find(preview => preview.file === file);
      if (removed) URL.revokeObjectURL(removed.url);
      return previews.filter(preview => preview.file !== file);
    });
    this.form.get('images')?.setValue(this.galleryPreviews().map(preview => preview.file));
  }


  create(){
    if (this.form.valid) {
      const formData = new FormData();

      formData.append('name', this.form.get('name')?.value);
      formData.append('description', this.form.get('description')?.value);
      formData.append('price', this.form.get('price')?.value);
      formData.append('category_id', this.form.get('category_id')?.value);

      const coverImage = this.form.get('cover_image')?.value;
      if (coverImage) {
        formData.append('cover_image', coverImage);
      }

      const galleryImages: File[] = this.form.get('images')?.value || [];
      galleryImages.forEach((img, index) => {
        formData.append('images[]', img);
      });

      this.confirm(formData)
    }


  }
}
