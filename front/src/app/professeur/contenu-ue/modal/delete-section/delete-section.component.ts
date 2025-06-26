import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Section} from '../../../../core/models/section.model';

@Component({
  selector: 'app-delete-section',
  imports: [],
  templateUrl: './delete-section.component.html',
  styleUrl: './delete-section.component.css'
})
export class DeleteSectionComponent {
  @Input() section!: Section;
  @Output() confirm = new EventEmitter<number>();
  @Output() close = new EventEmitter<void>();

  onConfirm() {
    this.confirm.emit(this.section.id);
  }

  onClose() {
    this.close.emit();
  }
}
