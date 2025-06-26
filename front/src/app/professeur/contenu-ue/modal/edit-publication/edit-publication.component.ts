import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Publication, Section} from '../../../../core/models/temp-publication.model';
import {FormsModule} from '@angular/forms';
import {Utilisateur} from '../../../../core/models/temp-utilisateur.model';

@Component({
  selector: 'app-edit-publication',
  imports: [
    FormsModule,
  ],
  templateUrl: './edit-publication.component.html',
  styleUrl: './edit-publication.component.css'
})
export class EditPublicationComponent {
  @Input() section!: Section;
  @Input() utilisateur!: Utilisateur;
  @Output() close = new EventEmitter<void>();
  @Output() update = new EventEmitter<any>();
  @Input() publication!: Publication;

  titre = '';
  contenuTexte: string | undefined = '';
  typePublicationId = 1;
  visible: boolean = true;
  contenuFichier: File | null = null;

  ngOnInit() {
    if (this.publication) {
      this.titre = this.publication.nom;
      this.contenuTexte = this.publication.contenu;
      this.typePublicationId =  1;
      this.visible = this.publication.visible;
    }
  }

  onSubmit() {
    const updatedPublication = {
      ...this.publication,
      titre: this.titre,
      utilisateur_id_id: this.utilisateur.id,
      utilisateur_id_prenom: this.utilisateur.prenom,
      contenuTexte: this.contenuTexte,
      typePublicationId: { id: this.typePublicationId },
      derniereModif: { date: new Date() },
      visible: this.visible,
    };
    this.update.emit(updatedPublication);
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
}
