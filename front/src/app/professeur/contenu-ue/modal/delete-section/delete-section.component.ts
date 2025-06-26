import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Section} from '../../../../core/models/temp-publication.model';
import {UeService} from '../../../../core/services/ue.service';

@Component({
  selector: 'app-delete-section',
  imports: [],
  templateUrl: './delete-section.component.html',
  styleUrl: './delete-section.component.css'
})
export class DeleteSectionComponent {
  @Input() section!: Section;
  @Input() codeUe!: string;

  constructor(private ueService : UeService) { }

  @Output() confirm = new EventEmitter<void>();
  @Output() close = new EventEmitter<void>();

  onConfirm() {
    this.ueService.deleteSection(this.codeUe, this.section._id).subscribe({
      next: () => {
        this.confirm.emit();
        this.onClose();
      }, error: err => {
        console.log(err);
      }
    })
  }

  onClose() {
    this.close.emit();
  }
}
