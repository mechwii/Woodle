import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Section} from '../../../../core/models/section.model';
import {FormsModule} from '@angular/forms';
import {Utilisateur} from '../../../../core/models/temp-utilisateur.model';
import {Publication} from '../../../../core/models/temp-publication.model';
import {NgStyle} from '@angular/common';

@Component({
  selector: 'app-add-publication',
  imports: [
    FormsModule,
    NgStyle
  ],
  templateUrl: './add-publication.component.html',
  styleUrl: './add-publication.component.css'
})
export class AddPublicationComponent {
  @Input() section!: Section;
  @Input() utilisateur!: Utilisateur;
  @Output() close = new EventEmitter<void>();
  @Output() submit = new EventEmitter<any>();

  titre = '';
  contenuTexte = '';
  typePublicationId = 1;
  visible: boolean = true;
  contenuFichier: File | null = null;

  onSubmit() {
    const publication: Publication = {
      id: 0, // ou laisse le backend l'attribuer si non requis à la création
      titre: this.titre,
      derniereModif: {
        date: new Date().toISOString() // format string
      },
      utilisateur_id_id: this.utilisateur.id,
      utilisateur_id_prenom: this.utilisateur.prenom,
      utilisateur_id_nom: this.utilisateur.nom,
      contenuTexte: this.contenuTexte || '',
      contenuFichier: this.contenuFichier ? this.contenuFichier.name : '',
      typePublicationId: {
        id: this.typePublicationId
      },
      visible: this.visible,
      section_id: this.section.id
    };
    this.submit.emit(publication);
    this.close.emit();
  }

  onCancel() {
    this.close.emit();
  }

  onFileSelected($event: Event) {
    const input = $event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      this.contenuFichier = input.files[0];

      // Optionnel : pour afficher ou uploader le nom du fichier
      console.log('Fichier sélectionné :', this.contenuFichier.name);
    }
  }

  // var concernant les boutons switch au dessus du formulaire
  isTextSelected = true;

  selectText() {
    this.isTextSelected = true;
    this.typePublicationId = 1;
  }

  selectFile() {
    this.isTextSelected = false;
    this.typePublicationId = 2;
  }
}
