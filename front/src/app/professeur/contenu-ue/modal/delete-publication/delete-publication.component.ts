import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-delete-publication',
  imports: [],
  templateUrl: './delete-publication.component.html',
  styleUrl: './delete-publication.component.css'
})
export class DeletePublicationComponent {
  @Input() publicationTitre: string = '';
  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  onConfirm() {
    this.confirm.emit();
  }

  onCancel() {
    this.cancel.emit();
  }
}
