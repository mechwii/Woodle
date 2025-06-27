import {Component, EventEmitter, Input, Output} from '@angular/core';
import {DatePipe, NgClass} from '@angular/common';
import {Publication} from '../../../../core/models/temp-publication.model';
import {AuthService} from '../../../../core/services/auth.service';
import {FilesService} from '../../../../core/services/files.service';

@Component({
  selector: 'app-publication',
  standalone: true,
  imports: [
    DatePipe, NgClass
  ],
  templateUrl: './publication.component.html',
  styleUrl: './publication.component.css'
})
export class PublicationComponent {
  @Input() publication!: Publication;
  @Output() deletePublication = new EventEmitter();
  @Output() editPublication = new EventEmitter();
  @Input() codeUe!: string;

  public constructor(public authService : AuthService, private filesService : FilesService) {
  }

  get getClass(): string {
    if (this.publication.type === 'fichier') return 'file';

    switch (this.publication.importance) {
      case 'faible': return 'calendar';
      case 'important': return 'warning';
      case 'moyen': return 'info';
      default: return '';
    }
  }

  openEditModal() {
    this.editPublication.emit(this.publication);
  }


  openDeleteModal() {
    this.deletePublication.emit(this.publication);
  }

  openFile() {
    // nom dans metadata (adapt-le si ta structure diffère)
    const filename = this.publication.metadata?.nom_original;

    console.log(filename);

    if (!filename || !this.codeUe) return;

    this.filesService.getFile(this.codeUe, filename).subscribe({
      next: blob => {
        const url = URL.createObjectURL(blob);

        if (filename.toLowerCase().endsWith('.pdf')) {
          window.open(url, '_blank');
        } else {
          const a = document.createElement('a');
          a.href = url;
          a.download = filename;
          a.style.display = 'none';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        }
        URL.revokeObjectURL(url);
      },
      error: err => console.error('Erreur fichier :', err)
    });
  }



}
