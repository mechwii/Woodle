import {Component, ElementRef, EventEmitter, HostListener, OnInit, Output} from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { DropZoneComponent } from '../../drop-zone/drop-zone.component';
import { MultiselectComponent, Option } from '../../multiselect/multiselect.component';
import { ImageService } from '../../../../core/services/image.service';
import {UtilisateurService} from '../../../../core/services/utilisateur.service';
import {Utilisateur} from '../../../../core/models/user.model';

@Component({
  selector: 'app-add-edit-ue',
  templateUrl: './add-edit-ue.component.html',
  styleUrl: './add-edit-ue.component.css',
  standalone: true,
  imports: [ReactiveFormsModule, DropZoneComponent, MultiselectComponent]
})
export class AddEditUeComponent implements OnInit {
  addUeForm!: FormGroup;
  responsables = [
    { id: 1, nom: 'Durand', prenom: 'Pierre' },
    { id: 2, nom: 'Martin', prenom: 'Marie' }
  ];

  userOptions: Option[] = [
  ];

  selectedUserValues: string[] = [];
  selectedUserLabels: string[] = [];

  @Output() closePopupSignal = new EventEmitter();

  selectedImage: string = '';
  selectedFile: File | null = null;
  defaultImage: string = '';

  constructor(private fb: FormBuilder, private elementRef : ElementRef,private imageServ: ImageService, private userService : UtilisateurService) {}

  ngOnInit(): void {
    this.addUeForm = this.fb.group({
      code: ['', Validators.required],
      nom: ['', Validators.required],
      responsableId: ['', Validators.required],
      utilisateurs: [[]],
      file: [null],
      image: ['']
    });

    this.imageServ.getImageURL('default-ban.jpg', 'ue').subscribe((res) => {
      this.defaultImage = res;
      this.addUeForm.patchValue({ image: res });
    });

    this.userService.getAllUsers().subscribe({
      next: data => {
        (data as Utilisateur[]).forEach((user: Utilisateur) => {
          this.userOptions.push({name : user.prenom.concat(" " + user.nom), value : user.id_utilisateur.toString()});
        })
      },
      error: err => {
        console.log(err);
      }
    })
  }

  get formValues() {
    return this.addUeForm.value;
  }

  onSubmit() {
    if (this.addUeForm.valid) {
      console.log('UE soumise:', this.formValues);
    }
  }

  onImageSelected(file: File): void {
    this.selectedFile = file;

    const reader = new FileReader();
    reader.onload = (e) => {
      this.selectedImage = e.target?.result as string;
    };
    reader.readAsDataURL(file);

    this.addUeForm.patchValue({ file: file });
  }

  onUserSelectionChange(selectedOptions: Option[]) {
    this.selectedUserValues = selectedOptions.map(opt => opt.value);
    this.selectedUserLabels = selectedOptions.map(opt => opt.name);
    this.addUeForm.patchValue({ utilisateurs: this.selectedUserValues });
  }

  onUserOptionAdded(option: Option) {
    console.log('Utilisateur ajouté:', option);
  }

  onUserOptionRemoved(option: Option) {
    console.log('Utilisateur supprimé:', option);
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
