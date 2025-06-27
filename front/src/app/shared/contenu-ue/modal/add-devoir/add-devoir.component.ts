import {Component, EventEmitter, Output} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {Devoirs} from '../../../../core/models/temp-publication.model';

@Component({
  selector: 'app-add-devoir',
  imports: [
    FormsModule
  ],
  templateUrl: './add-devoir.component.html',
  styleUrl: './add-devoir.component.css'
})
export class AddDevoirComponent {
  @Output() close = new EventEmitter<void>();
  @Output() addDevoir = new EventEmitter<Devoirs>();

  devoir: Devoirs = {
    _id: 0,
    titre: '',
    description: '',
    publicateur_id: 0,
    date_creation: new Date().toISOString(),
    date_limite: '',
    visible: true,
    instructions: {
      taille_fichier: 5,
      type_fichier: 1
    },
    soumissions: []
  };

  valider() {
    this.addDevoir.emit(this.devoir);
    this.close.emit();
  }

  fermer() {
    this.close.emit();
  }
}
