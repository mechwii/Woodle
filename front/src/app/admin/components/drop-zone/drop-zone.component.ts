import {Component, ElementRef, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild} from '@angular/core';

@Component({
  selector: 'app-drop-zone',
  imports: [],
  templateUrl: './drop-zone.component.html',
  styleUrl: './drop-zone.component.css'
})
export class DropZoneComponent implements OnChanges{
  @Output() fileSelected = new EventEmitter<File>();
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  dragOver = false;
  selectedFile: File | null = null;
  thumbnailUrl: string = '';

  @Input() optionnalFile?: File;
  @Input() mode?:string = 'image' ; //'image' | 'pdf' | 'zip' | 'file' = 'image'
  @Input() maxSizeMb?: number;


  ngOnChanges(changes: SimpleChanges): void {
    if (changes['optionnalFile']) {
      if (this.optionnalFile) {
        this.processFile(this.optionnalFile);
      }
    }
  }


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

    const fileSizeMo = file.size / (1024 * 1024); // Convertir en Mo

    if(this.maxSizeMb){
      console.log('Taille fichier ' + fileSizeMo)
      console.log('taille autorisé'  + this.maxSizeMb)
    }

    if (this.maxSizeMb && fileSizeMo > this.maxSizeMb) {
      alert(`Le fichier dépasse la taille maximale autorisée (${this.maxSizeMb} Mo).`);
      return;
    }

    const fileType = file.type;
    const fileName = file.name;


    const isValid = (
      !this.mode || // Aucun filtre si mode undefined
      this.mode === 'fichier' ||
      (this.mode === 'image' && fileType.startsWith('image/')) ||
      (this.mode === 'pdf' && fileType === 'application/pdf') ||
      (this.mode === 'zip' && (fileType === 'application/zip' || fileName.endsWith('.zip')))
    );

    if (!isValid) {
      alert(`Le fichier sélectionné n'est pas un ${this.mode ?? 'format supporté'}`);
      return;
    }

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
