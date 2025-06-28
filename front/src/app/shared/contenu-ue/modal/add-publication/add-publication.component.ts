import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {Utilisateur} from '../../../../core/models/temp-utilisateur.model';
import {Publication, Section} from '../../../../core/models/temp-publication.model';
import {NgStyle} from '@angular/common';
import {AuthService} from '../../../../core/services/auth.service';
import {DropZoneComponent} from '../../../../admin/components/drop-zone/drop-zone.component';
import {FilesService} from '../../../../core/services/files.service';
import {UeService} from '../../../../core/services/ue.service';

@Component({
  selector: 'app-add-publication',
  imports: [
    FormsModule,
    NgStyle,
    ReactiveFormsModule,
    DropZoneComponent
  ],
  templateUrl: './add-publication.component.html',
  styleUrl: './add-publication.component.css'
})
export class AddPublicationComponent implements OnInit {
  @Input() section!: Section;
  @Input() codeUe!: string;
  form!: FormGroup;


  @Output() close = new EventEmitter<void>();
  @Output() submit = new EventEmitter<any>();

  constructor(private fb: FormBuilder, private authService : AuthService, private fileService : FilesService, private ueService : UeService) { }

  typePublicationId = 1;
  contenuFichier?: File;

  ngOnInit(): void {
    this.form = this.fb.group({
      titre : ['', Validators.required],
      contenu : [''],
      importance : [''],
      visible : false
    })

  }

  onSubmit() {
    if (!this.form.valid) {
      console.log(this.form.errors);
      return;
    }

    const baseData = {
      publicateur_id: this.authService.getIdUser(),
      nom: this.form.get('titre')?.value,
      visible: this.form.get('visible')?.value,
    };

    console.log(baseData);


    if (this.typePublicationId === 1) {
      const data: Publication = {
        ...baseData,
        type: 'annonce',
        contenu: this.form.get('contenu')?.value,
        importance: this.form.get('importance')?.value,
      };
      this.ueService.addPublication(this.codeUe, this.section._id, data).subscribe({
        next: () => {
          this.submit.emit();
          this.close.emit();
        },
        error: err => {
          console.error("Erreur lors de la création de la publication fichier:", err);
        }
      });
    } else {

      if (!this.contenuFichier) {
        console.log("Fichier manquant.");
        return;
      }

      console.log(this.contenuFichier)

      this.fileService.upload(this.contenuFichier, this.codeUe).subscribe({
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
          this.ueService.addPublication(this.codeUe, this.section._id, data).subscribe({
            next: () => {
              this.submit.emit();
              this.close.emit();
            },
            error: err => {
              console.error("Erreur lors de la création de la publication fichier:", err);
            }
          });
          },
        error: err => {
          console.error("Erreur upload:", err);
        }
      });
    }
  }

  onCancel() {
    this.close.emit();
  }

  onFileSelected(file: File) {
    this.contenuFichier = file;
  }

  isTextSelected = true;

  selectText() {
    this.isTextSelected = true;
    this.typePublicationId = 1;
  }

  selectFile() {
    this.isTextSelected = false;
    this.typePublicationId = 2;
  }
}
