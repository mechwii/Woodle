import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {Devoirs} from '../../../../core/models/temp-publication.model';
import {AuthService} from '../../../../core/services/auth.service';
import {UeService} from '../../../../core/services/ue.service';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-add-devoir',
  imports: [
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './add-devoir.component.html',
  styleUrl: './add-devoir.component.css'
})
export class AddDevoirComponent implements OnInit{
  @Output() close = new EventEmitter<void>();
  @Output() addDevoir = new EventEmitter<Devoirs>();
  @Input() secId! : number;

  constructor(private fb: FormBuilder, private activatedRoute : ActivatedRoute,private authService : AuthService, private ueService : UeService) {
  }

  form! : FormGroup;
  code! : string;

  ngOnInit() {
    this.form = this.fb.group({
      titre: ['', Validators.required],
      description: ['', Validators.required],
      date_limite: ['', Validators.required],
      taille_fichier: [0, Validators.required],
      type_fichier: ['', Validators.required],
    });

    this.code = this.activatedRoute.snapshot.params['code'];
  }

  valider() {
    if(this.form.valid){
      const data : Devoirs = {
        titre: this.form.get('titre')?.value,
        description: this.form.get('description')?.value,
        publicateur_id : this.authService.getIdUser(),
        date_limite: this.form.get('date_limite')?.value,
        instructions : {
          taille_fichier : this.form.get('taille_fichier')?.value,
          type_fichier: this.form.get('type_fichier')?.value
        }
      }
      this.ueService.addDevoir(this.code,this.secId,data).subscribe({
        next: () => {
          this.addDevoir.emit();
          this.close.emit();
        },
        error: (err) => {
          console.error(err);
        }
      })

    }
  }

  fermer() {
    this.close.emit();
  }
}
