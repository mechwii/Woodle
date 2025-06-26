import {Component, EventEmitter, Input, Output} from '@angular/core';
import {DatePipe, NgClass} from '@angular/common';
import {Publication} from '../../../../core/models/temp-publication.model';
import {AuthService} from '../../../../core/services/auth.service';

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

  public constructor(public authService : AuthService) {
  }

  get publicationClass(): string {
    switch (this.publication.type) {
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


}
