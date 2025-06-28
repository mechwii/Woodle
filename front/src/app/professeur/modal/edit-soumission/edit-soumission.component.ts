import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {Soumission} from '../../../core/models/temp-publication.model';
import {UeService} from '../../../core/services/ue.service';
import {Observable} from 'rxjs';
import {ActivatedRoute} from '@angular/router';
import {AuthService} from '../../../core/services/auth.service';

@Component({
  selector: 'app-edit-soumission',
  imports: [
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './edit-soumission.component.html',
  styleUrl: './edit-soumission.component.css'
})
export class EditSoumissionComponent implements OnInit{

  constructor(private fb : FormBuilder, private ueService : UeService, private routerActivated : ActivatedRoute, private authService : AuthService) {
  }

  code! : string;
  secId! : number;
  devoirId! : number;
  soumissionId! : number;

  @Input() soumission!: Soumission;
  @Output() close = new EventEmitter<void>();
  @Output() modifier = new EventEmitter<void>();

  form!: FormGroup;

  ngOnInit() {
    this.form = this.fb.group({
      note : [this.soumission.note ? this.soumission.note : 0, [Validators.required, Validators.min(0), Validators.max(20)] ],
      commentaire_prof : [this.soumission.commentaire_prof ? this.soumission.commentaire_prof : '', Validators.required],
      correcteur_id: this.authService.getIdUser()
    });

    this.code = this.routerActivated.snapshot.params['code'];
    this.secId = this.routerActivated.snapshot.params['secId'];
    this.devoirId = this.routerActivated.snapshot.params['id'];
    if(this.soumission && this.soumission._id){
      this.soumissionId = this.soumission._id
    }
  }

  closeModal() {
    this.close.emit();
  }

  valider() {
    if(this.form.valid){
      console.log(this.form.value);
      this.ueService.corrigerSoumissionUser(this.code, this.secId,this.devoirId,this.soumissionId,this.form.value).subscribe({
        next: () => {
          this.modifier.emit();
          this.closeModal();
        },
        error: (err) => {
          console.error(err);
        }
      })
    }
  }
}
