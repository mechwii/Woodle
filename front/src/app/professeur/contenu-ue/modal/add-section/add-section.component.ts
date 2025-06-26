import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {UeService} from '../../../../core/services/ue.service';

@Component({
  selector: 'app-add-section',
  imports: [
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './add-section.component.html',
  styleUrl: './add-section.component.css'
})
export class AddSectionComponent implements OnInit {
  @Output() close = new EventEmitter<void>();
  @Output() shouldUpdate = new EventEmitter<void>();

  @Input() codeUE!: string;

  constructor(private fb: FormBuilder, private ueService : UeService) {
  }
  addSectionForm!: FormGroup;

  ngOnInit() {
    this.addSectionForm = this.fb.group({
      nom: new FormControl('', [Validators.required]),
    });
  }

  onClose() {
    this.close.emit();
  }

  onSubmit() {
    if(this.addSectionForm.valid){
      if(this.addSectionForm.get('nom')?.value){
        const data = {nom:this.addSectionForm.get('nom')?.value,}
        this.ueService.addSection(this.codeUE, data).subscribe({
          next: () => {
            this.shouldUpdate.emit();
            this.onClose();
          }
        })
      }

    }

  }
}
