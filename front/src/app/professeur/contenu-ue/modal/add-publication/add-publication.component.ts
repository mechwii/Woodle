import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {Utilisateur} from '../../../../core/models/temp-utilisateur.model';
import {Publication, Section} from '../../../../core/models/temp-publication.model';
import {NgStyle} from '@angular/common';
import {AuthService} from '../../../../core/services/auth.service';

@Component({
  selector: 'app-add-publication',
  imports: [
    FormsModule,
    NgStyle,
    ReactiveFormsModule
  ],
  templateUrl: './add-publication.component.html',
  styleUrl: './add-publication.component.css'
})
export class AddPublicationComponent implements OnInit {
  @Input() section!: Section;
  @Input() utilisateur!: Utilisateur;
  @Input() codeUe!: string;
  form!: FormGroup;


  @Output() close = new EventEmitter<void>();
  @Output() submit = new EventEmitter<any>();

  constructor(private fb: FormBuilder, private authService : AuthService) { }

  typePublicationId = 1;
  visible: boolean = true;
  contenuFichier: File | null = null;

  ngOnInit(): void {
    this.form = this.fb.group({
      titre : ['', Validators.required],
      contenu : [''],
      importance : ['']
    })

  }

  onSubmit() {
    if(this.form.valid) {
      let data : Publication;
      if(this.typePublicationId === 1){
        data = {
          publicateur_id : this.authService.getIdUser(),
          nom : this.form.get('titre')?.value,
          visible: this.visible,
          type: 'Annonce'

        }


      } else {

      }

    }
    // this.submit.emit;
    // this.close.emit();
  }

  onCancel() {
    this.close.emit();
  }

  onFileSelected($event: Event) {
    const input = $event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      this.contenuFichier = input.files[0];

      console.log('Fichier sélectionné :', this.contenuFichier.name);
    }
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
