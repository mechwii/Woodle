import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Section} from '../../../../core/models/section.model';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-edit-section',
  imports: [
    FormsModule
  ],
  templateUrl: './edit-section.component.html',
  styleUrl: './edit-section.component.css'
})
export class EditSectionComponent {
  @Input() section!: Section;
  @Output() close = new EventEmitter<void>();
  @Output() updated = new EventEmitter<Section>();

  editedName: string = '';

  ngOnInit() {
    this.editedName = this.section.nom;
  }

  onClose() {
    this.close.emit();
  }

  onSubmit() {
    const updatedSection = { ...this.section, nom: this.editedName };
    this.updated.emit(updatedSection);
    this.onClose();
  }
}
