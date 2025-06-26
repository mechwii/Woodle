import {Component, EventEmitter, Output} from '@angular/core';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-add-section',
  imports: [
    FormsModule
  ],
  templateUrl: './add-section.component.html',
  styleUrl: './add-section.component.css'
})
export class AddSectionComponent {
  @Output() close = new EventEmitter<void>();

  onClose() {
    this.close.emit();
  }

  onSubmit() {
    // TODO : traitement du formulaire
    this.onClose();
  }
}
