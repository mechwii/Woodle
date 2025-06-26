import {Component, Input} from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import {Publication} from '../../../../core/models/temp-publication.model';
import {Utilisateur} from '../../../../core/models/temp-utilisateur.model';
import {EditPublicationComponent} from '../../modal/edit-publication/edit-publication.component';
import {DeletePublicationComponent} from '../../modal/delete-publication/delete-publication.component';

@Component({
  selector: 'app-publication',
  standalone: true,
  imports: [
    DatePipe, EditPublicationComponent, DeletePublicationComponent
  ],
  templateUrl: './publication.component.html',
  styleUrl: './publication.component.css'
})
export class PublicationComponent {
  @Input() publication!: Publication;
  @Input() roles!: string[];
  @Input() utilisateur!: Utilisateur;
  @Input() utilisateurId!: number;
  @Input() isEpingled = false;
  @Input() isEleve = false;

  get publicationClass(): string {
    switch (this.publication.typePublicationId.id) {
      case 2: return 'file';
      case 3: return 'calendar';
      case 4: return 'warning';
      case 5: return 'info';
      default: return '';
    }
  }

  // edit publicaiton modal
  showEditModal = false;

  openEditModal() {
    this.showEditModal = true;
  }

  closeEditModal() {
    this.showEditModal = false;
  }

  updatePublication(publication: any) {
    // ici, on pourrait appeler un service HTTP ou notifier le parent
    console.log('Publication mise à jour :', publication);
    this.publication = publication; // mise à jour locale
  }

  // delete publication modal
  showDeleteModal = false;

  openDeleteModal() {
    this.showDeleteModal = true;
  }

  closeDeleteModal() {
    this.showDeleteModal = false;
  }

  confirmDelete() {
    console.log('Publication supprimée :', this.publication.id);
    // Tu peux ici émettre un event @Output ou appeler un service
    this.closeDeleteModal();
  }
}
