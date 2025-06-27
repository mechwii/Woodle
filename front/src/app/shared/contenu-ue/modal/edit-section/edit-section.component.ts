import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {Section} from '../../../../core/models/temp-publication.model';
import {UeService} from '../../../../core/services/ue.service';

@Component({
  selector: 'app-edit-section',
  imports: [
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './edit-section.component.html',
  styleUrl: './edit-section.component.css'
})
export class EditSectionComponent implements OnInit {
  @Input() section!: Section;
  @Output() close = new EventEmitter<void>();
  @Output() updated = new EventEmitter<void>();
  @Input() codeUe! : string;

  editSectionForm!: FormGroup;

  constructor(private fb: FormBuilder, private ueService : UeService) {
  }

  ngOnInit() {
    if(this.section){
      this.editSectionForm = this.fb.group({
        nom: new FormControl(this.section.nom, [Validators.required]),
      });
    }

  }


  onClose() {
    this.close.emit();
  }

  onSubmit() {
    if(this.editSectionForm.valid){
      const nom = {nom :this.editSectionForm.controls['nom'].value};
      this.ueService.editSection(this.codeUe, this.section._id, nom).subscribe({
        next: ()=>{
          this.updated.emit();
          this.onClose();
        }, error: (err)=>{
          console.log(err);
        }
      })

    }

  }
}
