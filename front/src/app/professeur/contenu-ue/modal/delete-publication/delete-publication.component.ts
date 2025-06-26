import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Publication, Section} from '../../../../core/models/temp-publication.model';

@Component({
  selector: 'app-delete-publication',
  imports: [],
  templateUrl: './delete-publication.component.html',
  styleUrl: './delete-publication.component.css'
})
export class DeletePublicationComponent {
  @Input() publication!: Publication;
  @Input() section!: Section;
  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  onConfirm() {
    this.confirm.emit();
  }

  onCancel() {
    this.cancel.emit();
  }
}
