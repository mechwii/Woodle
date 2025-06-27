import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {Soumission} from '../../../../core/models/temp-publication.model';

@Component({
  selector: 'app-edit-soumission',
  imports: [
    FormsModule
  ],
  templateUrl: './edit-soumission.component.html',
  styleUrl: './edit-soumission.component.css'
})
export class EditSoumissionComponent {
  @Input() soumission!: Soumission;
  @Output() close = new EventEmitter<void>();
  @Output() modifier = new EventEmitter<Soumission>();

  closeModal() {
    this.close.emit();
  }

  valider() {
    this.modifier.emit(this.soumission);
    this.closeModal();
  }
}
