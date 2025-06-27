import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {Forum} from '../../../../core/models/temp-publication.model';
import {ActivatedRoute} from '@angular/router';
import {AuthService} from '../../../../core/services/auth.service';
import {UeService} from '../../../../core/services/ue.service';

@Component({
  selector: 'app-add-forum',
    imports: [
        ReactiveFormsModule
    ],
  templateUrl: './add-forum.component.html',
  styleUrl: './add-forum.component.css'
})
export class AddForumComponent implements OnInit {
  @Output() close = new EventEmitter<void>();
  @Output() addForum = new EventEmitter<Forum>();
  @Input() secId! : number;

  constructor(private fb: FormBuilder, private activatedRoute : ActivatedRoute,private authService : AuthService, private ueService : UeService) {
  }

  form! : FormGroup;
  code! : string;

  ngOnInit() {
    this.form = this.fb.group({
      titre: ['', Validators.required],
      description: ['', Validators.required],
    });

    this.code = this.activatedRoute.snapshot.params['code'];
  }

  valider() {
    if(this.form.valid){
      const data : Forum = {
        titre: this.form.get('titre')?.value,
        description: this.form.get('description')?.value,
        createur_id: this.authService.getIdUser(),
      }
      this.ueService.addForum(this.code,this.secId,data).subscribe({
        next: () => {
          this.addForum.emit();
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
