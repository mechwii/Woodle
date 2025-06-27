import {ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Publication, Section} from '../../../../core/models/temp-publication.model';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {Utilisateur} from '../../../../core/models/temp-utilisateur.model';
import {AuthService} from '../../../../core/services/auth.service';
import {FilesService} from '../../../../core/services/files.service';
import {UeService} from '../../../../core/services/ue.service';
import {DropZoneComponent} from '../../../../admin/components/drop-zone/drop-zone.component';

@Component({
  selector: 'app-edit-publication',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    DropZoneComponent,
  ],
  templateUrl: './edit-publication.component.html',
  styleUrl: './edit-publication.component.css'
})
export class EditPublicationComponent implements OnInit{
  @Input() section!: Section;
  @Input() utilisateur!: Utilisateur;
  @Input() codeUe!: string;
  @Input() publication!: Publication;


  form!: FormGroup;


  @Output() close = new EventEmitter<void>();
  @Output() update = new EventEmitter<any>();

  constructor(private fb: FormBuilder, private authService : AuthService, private fileService : FilesService, private ueService : UeService, private cdr : ChangeDetectorRef) { }

  typePublicationId!: number ;
  visible!: boolean ;
  contenuFichier?: File;

  fichierPublication?: File;

  ngOnInit(): void {
    if(this.publication){
      if(this.publication.type === 'fichier' && this.publication.metadata && this.publication.metadata.nom_original){
        this.form = this.fb.group({
          nom : [this.publication.nom , Validators.required],
          visible : this.publication.visible,
          metadata: this.publication.metadata,
        })
        console.log(this.publication.metadata.nom_original);
        console.log(this.codeUe);

        this.fileService.getFileinFileFormat(this.codeUe, this.publication.metadata.nom_original).subscribe({
          next: (file: File) => {
            this.contenuFichier = file;
            this.fichierPublication = file;
            console.log(this.fichierPublication);
            this.cdr.detectChanges();
          },
          error: (err) => {
            console.error('Erreur récupération fichier', err);
          }
        });


      } else {
        this.form = this.fb.group({
          nom : [this.publication.nom , Validators.required],
          contenu : [this.publication.nom, Validators.required],
          importance : [this.publication.importance],
          visible : this.publication.visible,
        })
      }


    }
  }

  onSubmit() {
    if (!this.form.valid) {
      console.log(this.form.errors);
      return;
    }

    if(this.publication && this.publication._id){
      const baseData = {
        nom: this.form.get('nom')?.value,
        visible: this.form.get('visible')?.value,
      };

      if(this.publication.type === 'annonce'){
        const data: Publication = {
          ...baseData,
          type: this.publication.type,
          contenu: this.form.get('contenu')?.value,
          importance: this.form.get('importance')?.value,
        };

        this.ueService.updatePublication(this.codeUe, this.section._id, this.publication._id, data).subscribe({
          next: () => {
            this.update.emit();
            this.close.emit();
          },
          error: err => {
            console.error("Erreur lors de la création de la publication fichier:", err);
          }
        });

      } else {
        if(this.contenuFichier && this.publication.metadata && this.publication.metadata.nom_original){

          if(this.contenuFichier?.name !== this.publication.metadata.nom_original){
            this.fileService.remove(this.codeUe,this.publication.metadata.nom_original).subscribe({
              next:() =>{

              }, error: (err) => {
                console.error("Erreur lors de la suppression du fichier:", err);
              }
            })
          }

          this.fileService.upload(this.contenuFichier, this.codeUe ).subscribe({
            next: response  => {
              const res = (response) as any;
              const data: Publication = {
                ...baseData,
                type: 'fichier',
                metadata : {
                  nom_original : res.nom_original,
                  extension : res.extension,
                  taille: res.taille,
                  nom_stockage : res.nom_stockage
                },
              };
              console.log(data);
              this.ueService.updatePublication(this.codeUe, this.section._id, this.publication._id, data).subscribe({
                next: () => {
                  this.update.emit();
                  this.close.emit();
                },
                error: err => {
                  console.error("Erreur lors de la création de la publication fichier:", err);
                }
              });
            }, error : err => {
              console.error("Erreur upload:", err);
            }
          })


            const data: Publication = {
            ...baseData,
            type: this.publication.type,
            metadata : {
              nom_original : this.publication.metadata.nom_original,
              extension : this.publication.metadata.extension,
              taille: this.publication.metadata.taille,
              nom_stockage : this.publication.metadata.nom_stockage
            }
          }
        }

      }

    }


  }

  onCancel() {
    this.close.emit();
  }

  onFileSelected(file: any) {
    this.contenuFichier = file;
  }

}
