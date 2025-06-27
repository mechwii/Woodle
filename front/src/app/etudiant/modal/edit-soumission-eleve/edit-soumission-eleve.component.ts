import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Devoirs, Soumission} from '../../../core/models/temp-publication.model';
import {DropZoneComponent} from '../../../admin/components/drop-zone/drop-zone.component';
import {FilesService} from '../../../core/services/files.service';
import {ActivatedRoute} from '@angular/router';
import {AuthService} from '../../../core/services/auth.service';
import {UeService} from '../../../core/services/ue.service';

@Component({
  selector: 'app-edit-soumission-eleve',
  imports: [
    DropZoneComponent
  ],
  templateUrl: './edit-soumission-eleve.component.html',
  styleUrl: './edit-soumission-eleve.component.css'
})
export class EditSoumissionEleveComponent {

  constructor(private fileService : FilesService, private activatedRoute : ActivatedRoute, private authService : AuthService, private ueService : UeService) {
  }

  @Input() soumission!: Soumission;
  @Output() close = new EventEmitter<void>();
  @Output() valider = new EventEmitter<Soumission>();
  @Input() Devoir! : Devoirs;

  selectedFile?: File;


  onValider() {
    if(this.selectedFile){
      this.fileService.upload(this.selectedFile,this.activatedRoute.snapshot.params['code']).subscribe({
        next : (resu)  =>{
          let res = resu as any;
          const data : Soumission = {
            etudiant_id: this.authService.getIdUser(),
            date_soumission : new Date().toISOString(),
            fichiers: {
              nom_original: res.nom_original,
              nom_stockage: res.nom_stockage,
              extension : res.extension,
              taille: res.taille
            }
          }
          if(this.Devoir && this.Devoir._id){
            this.ueService.addSoumission(this.activatedRoute.snapshot.params['code'],this.activatedRoute.snapshot.params['secId'], this.Devoir._id, data).subscribe({
              next: () => {
                this.valider.emit();
                this.onFermer();
              },
              error: (err) => console.error(err)
            })

          }

        }
      })

    }
  }

  onFermer() {
    this.close.emit();
  }

  onFileSelected(file : any){
    this.selectedFile = file;
  }
}
