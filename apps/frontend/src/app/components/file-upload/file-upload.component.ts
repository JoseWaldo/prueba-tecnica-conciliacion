import { Component, ElementRef, EventEmitter, input, Output, signal, viewChild } from '@angular/core';

@Component({
  selector: 'app-file-upload',
  imports: [],
  templateUrl: './file-upload.component.html',
  styleUrl: './file-upload.component.scss',
})
export class FileUploadComponent {
  readonly label = input.required<string>();
  readonly accept = input('.csv');
  readonly hint = input('Soportado: CSV · máx. 90 MB');
  readonly maxSizeMb = input(90);
  readonly iconLabel = input('CSV');

  @Output() readonly fileChange = new EventEmitter<File | null>();

  private readonly fileInput = viewChild.required<ElementRef<HTMLInputElement>>('fileInput');

  readonly file = signal<File | null>(null);
  readonly error = signal<{ name: string; reason: string } | null>(null);
  readonly dragging = signal(false);

  private dragCounter = 0;

  protected get maxSizeBytes(): number {
    return this.maxSizeMb() * 1024 * 1024;
  }

  protected open(): void {
    this.fileInput().nativeElement.click();
  }

  protected onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.open();
    }
  }

  protected onDragEnter(event: DragEvent): void {
    event.preventDefault();
    this.dragCounter++;
    this.dragging.set(true);
  }

  protected onDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  protected onDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.dragCounter--;
    if (this.dragCounter <= 0) {
      this.dragCounter = 0;
      this.dragging.set(false);
    }
  }

  protected onDrop(event: DragEvent): void {
    event.preventDefault();
    this.dragCounter = 0;
    this.dragging.set(false);
    const files = event.dataTransfer?.files;
    if (files && files.length) this.setFile(files[0]);
  }

  protected onChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;
    if (file) this.setFile(file);
    input.value = '';
  }

  protected clear(): void {
    this.file.set(null);
    this.error.set(null);
    this.fileChange.emit(null);
  }

  protected formatSize(bytes: number): string {
    if (bytes >= 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    if (bytes >= 1024) return Math.round(bytes / 1024) + ' KB';
    return bytes + ' B';
  }

  private setFile(file: File): void {
    if (!this.isValidType(file)) {
      this.fail(file, 'Tipo no soportado');
      return;
    }
    if (file.size > this.maxSizeBytes) {
      this.fail(file, 'Archivo demasiado grande');
      return;
    }
    this.error.set(null);
    this.file.set(file);
    this.fileChange.emit(file);
  }

  private fail(file: File, reason: string): void {
    this.file.set(null);
    this.error.set({ name: file.name, reason });
    this.fileChange.emit(null);
  }

  private isValidType(file: File): boolean {
    const extensions = this.accept()
      .split(',')
      .map((s) => s.trim().toLowerCase())
      .filter((s) => s.startsWith('.'));
    if (extensions.length === 0) return true;
    const name = file.name.toLowerCase();
    return extensions.some((ext) => name.endsWith(ext));
  }
}
