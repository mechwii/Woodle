import {Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output} from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { DropZoneComponent } from '../../drop-zone/drop-zone.component';
import { MultiselectComponent, Option } from '../../multiselect/multiselect.component';
import { UE } from '../../../../core/models/ue.model';
import { Roles } from '../../../../core/models/auth.model';
import { ImageService } from '../../../../core/services/image.service';
import {UeService} from '../../../../core/services/ue.service';
import {Utilisateur} from '../../../../core/models/user.model';

@Component({
  selector: 'app-add-edit-user',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    DropZoneComponent,
    MultiselectComponent
  ],
  templateUrl: './add-edit-user.component.html',
  styleUrl: './add-edit-user.component.css'
})
export class AddEditUserComponent implements OnInit {
  addUserForm!: FormGroup;

  roles: Roles[] = [];
  defaultPicture: string = 'default.jpg';

  selectedImage: string = '';
  selectedFile: File | null = null;

  @Output() closePopupSignal = new EventEmitter();
  @Input() user? : Utilisateur;

  ueOptions: Option[] = [];

  selectedUeValues: string[] = [];


  constructor(private fb: FormBuilder, private elementRef : ElementRef,private imageServ: ImageService, private ueService : UeService) {}

  ngOnInit(): void {
    this.roles = [
      { id_role: 1, nom: 'ROLE_ADMINISTRATEUR' },
      { id_role: 2, nom: 'ROLE_PROFESSEUR' },
      { id_role: 3, nom: 'ROLE_ELEVE' }
    ];



    this.addUserForm = this.fb.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      roles: this.fb.array([]),
      ues: [[]],
      utilisateurs: [[]],
      file: [null],
      picture: ['']
    });

    this.imageServ.getImageURL(this.defaultPicture, 'profile').subscribe(res => {
      this.defaultPicture = res;
      this.addUserForm.patchValue({ picture: res });
    });

    this.ueService.getAllUEs().subscribe({
      next: (res) => {
        (res as UE[]).forEach((ue) => {
          this.ueOptions.push({value : ue.code, name : ue.nom})
        })

      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  sendImage(): void {
    this.imageServ.uploadImage((this.selectedFile as File), 'profile').subscribe(res => {
      console.log(res);
    })





  }


  get formValues() {
    return this.addUserForm.value;
  }

  onSubmit(): void {
    if (this.addUserForm.valid) {
      console.log('Formulaire soumis :', this.formValues);
    }
  }

  onImageSelected(file: File): void {
    console.log('Image sélectionnée:', file.name);
    this.selectedFile = file;

    const reader = new FileReader();
    reader.onload = (e) => {
      this.selectedImage = e.target?.result as string;
    };
    reader.readAsDataURL(file);

    this.addUserForm.patchValue({ file: file });
  }

  resetUpload(): void {
    this.selectedImage = '';
    this.selectedFile = null;
    this.addUserForm.patchValue({ file: null });
  }

  // --- MULTISELECT UE ---
  onUeSelectionChange(selectedOptions: Option[]): void {
    this.selectedUeValues = selectedOptions.map(opt => opt.value);

    this.addUserForm.patchValue({ ues: this.selectedUeValues });

    console.log('UE sélectionnées :', selectedOptions);
    console.log('all Ues :', this.addUserForm.get('ues')?.value);

  }

  onUeOptionAdded(option: Option): void {
    console.log('UE ajoutée :', option);
  }

  onUeOptionRemoved(option: Option): void {
    console.log('UE retirée :', option);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.closePopup();
    }
  }

  closePopup() {
    // Logique pour fermer la popup (ex: masquer via service ou classe CSS)
    this.closePopupSignal.emit();
  }

}
