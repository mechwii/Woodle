import {Component, Input} from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import {Publication} from '../../../../core/models/temp-publication.model';

@Component({
  selector: 'app-publication-epinglee',
  standalone: true,
  imports: [
    DatePipe
  ],
  templateUrl: './publication-epinglee.component.html',
  styleUrl: './publication-epinglee.component.css'
})
export class PublicationEpingleeComponent {
  @Input() publication!: Publication;
  @Input() roles!: string[];
  @Input() utilisateurId!: number;
  @Input() isEpingled = false;

  get publicationClass(): string {
    switch (this.publication.typePublicationId.id) {
      case 2: return 'file';
      case 3: return 'calendar';
      case 4: return 'warning';
      case 5: return 'info';
      default: return '';
    }
  }
}
