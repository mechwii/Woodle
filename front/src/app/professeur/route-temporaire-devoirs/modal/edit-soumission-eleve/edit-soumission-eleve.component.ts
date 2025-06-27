import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Soumission} from '../../../../core/models/temp-publication.model';

@Component({
  selector: 'app-edit-soumission-eleve',
  imports: [],
  templateUrl: './edit-soumission-eleve.component.html',
  styleUrl: './edit-soumission-eleve.component.css'
})
export class EditSoumissionEleveComponent {

  @Input() soumission!: Soumission;
  @Output() close = new EventEmitter<void>();
  @Output() valider = new EventEmitter<Soumission>();

  selectedFile?: File;

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];

      // Simule les métadonnées à stocker
      this.soumission.fichiers = {
        nom_original: this.selectedFile.name,
        nom_stockage: `depot_${Date.now()}.${this.selectedFile.name.split('.').pop()}`,
        extension: this.selectedFile.name.split('.').pop() ?? 'pdf'
      };

      this.soumission.date_soumission = new Date().toISOString();
      this.soumission.statut = 'Soumis';
    }
  }

  onValider() {
    this.valider.emit(this.soumission);
    this.onFermer();
  }

  onFermer() {
    this.close.emit();
  }

}
