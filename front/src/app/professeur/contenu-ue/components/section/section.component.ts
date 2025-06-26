import {Component, Input} from '@angular/core';
import {Section} from '../../../../core/models/section.model';
import {Publication} from '../../../../core/models/temp-publication.model';
import {PublicationComponent} from '../publication/publication.component';
import {EditSectionComponent} from '../../modal/edit-section/edit-section.component';
import {DeleteSectionComponent} from '../../modal/delete-section/delete-section.component';
import { AddPublicationComponent } from '../../modal/add-publication/add-publication.component';
import {Utilisateur} from '../../../../core/models/temp-utilisateur.model';
import {DevoirComponent} from '../devoir/devoir.component';

@Component({
  selector: 'app-section',
  imports: [
    PublicationComponent, EditSectionComponent, DeleteSectionComponent, AddPublicationComponent, DevoirComponent
  ],
  templateUrl: './section.component.html',
  styleUrl: './section.component.css'
})

export class SectionComponent {
  @Input() section!: Section;
  @Input() publications!: Publication[];
  @Input() roles!: string[];
  @Input() publicationsEpinglesIds!: number[];
  @Input() utilisateurId!: number;
  @Input() utilisateur!: Utilisateur;
  @Input() sectionDevoirs: any[] = [];


  get sectionPublications(): Publication[] {
    return this.publications.filter(
      pub => pub.id === this.section.id && (pub.visible || this.roles.includes('ROLE_PROFESSEUR'))
    );
  }

  isEleve(): boolean {
    return this.roles.includes('ROLE_ELEVE');
  }

  // edit modal
  isEditSectionModalOpen = false;

  openEditSectionModal() {
    this.isEditSectionModalOpen = true;
  }

  closeEditSectionModal() {
    this.isEditSectionModalOpen = false;
  }

  onSectionUpdated(updated: Section) {
    // ici tu peux appeler un service HTTP pour le sauvegarder, ou émettre un Output vers le parent
    this.section.nom = updated.nom; // temporaire
  }

  // delete modal
  isDeleteSectionModalOpen = false;

  openDeleteModal() {
    this.isDeleteSectionModalOpen = true;
  }

  closeDeleteModal() {
    this.isDeleteSectionModalOpen = false;
  }

  handleDeleteConfirmed(sectionId: number) {
    // Tu peux ici appeler un service HTTP pour supprimer, ou émettre un @Output vers le parent
    console.log('Supprimer la section ID', sectionId);
    this.closeDeleteModal();
  }

  // modal add publication
  showAddPublicationModal = false;

  openAddPublicationModal() {
    this.showAddPublicationModal = true;
  }

  closeAddPublicationModal() {
    this.showAddPublicationModal = false;
  }

  handlePublicationCreated(publication: Publication) {
    // Tu peux ici appeler un service pour persister la publication
    console.log('Nouvelle publication :', publication);

    // Ajoute localement (optionnel si tu relies à un service central)
    this.publications.push(publication);
  }


  openAddDevoirModal() {
    console.log();
  }
}
