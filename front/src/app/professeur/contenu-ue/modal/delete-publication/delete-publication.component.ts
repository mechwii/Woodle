import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Publication, Section} from '../../../../core/models/temp-publication.model';
import {FilesService} from '../../../../core/services/files.service';
import {UeService} from '../../../../core/services/ue.service';

@Component({
  selector: 'app-delete-publication',
  imports: [],
  templateUrl: './delete-publication.component.html',
  styleUrl: './delete-publication.component.css'
})
export class DeletePublicationComponent {


  constructor(private fileService : FilesService, private ueService : UeService) { }

  @Input() publication!: Publication;
  @Input() codeUe!: string;
  @Input() section!: Section;
  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  onConfirm() {
    if (this.publication && this.publication._id ) {
      if( this.publication.type === 'fichier' && this.publication.metadata){
        this.fileService.remove(this.codeUe, this.publication.metadata.nom_original).subscribe({
          next: () => {
            console.log('Supprimé')
          }, error: (err) => console.log(err)
        })

      }

      this.ueService.deletePublication(this.codeUe, this.section._id, this.publication._id).subscribe({
        next: () => {
          this.confirm.emit();
        }, error: err => {
          console.log(err);
        }
      })
    }
  }

  onCancel() {
    this.cancel.emit();
  }
}
