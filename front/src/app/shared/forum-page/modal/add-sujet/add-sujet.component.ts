import {Component, EventEmitter, Input, numberAttribute, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {Forum, Sujet} from '../../../../core/models/temp-publication.model';
import {ActivatedRoute} from '@angular/router';
import {AuthService} from '../../../../core/services/auth.service';
import {UeService} from '../../../../core/services/ue.service';

@Component({
  selector: 'app-add-sujet',
    imports: [
        ReactiveFormsModule
    ],
  templateUrl: './add-sujet.component.html',
  styleUrl: './add-sujet.component.css'
})
export class AddSujetComponent implements OnInit {

  @Output() close = new EventEmitter<void>();
  @Output() addSujet = new EventEmitter<Sujet>();
  @Input({transform: numberAttribute}) forumId! : number;

  constructor(private fb: FormBuilder, private activatedRoute : ActivatedRoute,private authService : AuthService, private ueService : UeService) {
  }

  form! : FormGroup;
  code! : string;
  secId! : number;

  ngOnInit() {
    this.form = this.fb.group({
      titre: ['', Validators.required],
    });

    this.code = this.activatedRoute.snapshot.params['code'];
    this.secId = this.activatedRoute.snapshot.params['secId'];
  }

  valider() {
    if(this.form.valid){
      const data : Sujet = {
        titre: this.form.get('titre')?.value,
        auteur_id: this.authService.getIdUser(),
      }
      this.ueService.addSujet(this.code,this.secId, this.forumId, data).subscribe({
        next: () => {
          this.addSujet.emit();
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
