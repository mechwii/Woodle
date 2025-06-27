import {Component, ElementRef, EventEmitter, Output, ViewChild} from '@angular/core';

@Component({
  selector: 'app-drop-zone',
  imports: [],
  templateUrl: './drop-zone.component.html',
  styleUrl: './drop-zone.component.css'
})
export class DropZoneComponent {
  @Output() fileSelected = new EventEmitter<File>();
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  dragOver = false;
  selectedFile: File | null = null;
  thumbnailUrl: string = '';

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.dragOver = true;
  }

  onDragLeave(event: DragEvent): void {
    this.dragOver = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.dragOver = false;

    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.processFile(files[0]);
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.processFile(input.files[0]);
    }
  }

  private processFile(file: File): void {
    /*if (!file.type.startsWith('image/')) {
      alert('Veuillez sélectionner une image');
      return;
    }*/

    this.selectedFile = file;

    const reader = new FileReader();
    reader.onload = (e) => {
      this.thumbnailUrl = `url('${e.target?.result}')`;
    };
    reader.readAsDataURL(file);

    this.fileSelected.emit(file);
  }

  reset(): void {
    this.selectedFile = null;
    this.thumbnailUrl = '';
    this.fileInput.nativeElement.value = '';
  }

}
