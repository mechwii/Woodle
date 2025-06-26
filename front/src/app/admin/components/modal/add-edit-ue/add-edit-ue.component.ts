import {Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormArray} from '@angular/forms';
import { DropZoneComponent } from '../../drop-zone/drop-zone.component';
import { MultiselectComponent, Option } from '../../multiselect/multiselect.component';
import { ImageService } from '../../../../core/services/image.service';
import {UtilisateurService} from '../../../../core/services/utilisateur.service';
import { Utilisateur} from '../../../../core/models/user.model';
import {UE, uePopup} from '../../../../core/models/ue.model';
import {FileModel, MetaData} from '../../../../core/models/file.model';
import {UeService} from '../../../../core/services/ue.service';
import {NgClass} from '@angular/common';

@Component({
  selector: 'app-add-edit-ue',
  templateUrl: './add-edit-ue.component.html',
  styleUrl: './add-edit-ue.component.css',
  standalone: true,
  imports: [ReactiveFormsModule, DropZoneComponent, MultiselectComponent, NgClass]
})
export class AddEditUeComponent implements OnInit {
  addUeForm!: FormGroup;
  responsables!: Utilisateur[];

  userOptions: Option[] = [
  ];

  selectedUserValues: string[] = [];
  selectedUserLabels: string[] = [];

  @Output() closePopupSignal = new EventEmitter();
  @Output() haveToEdit = new EventEmitter();

  @Input() ue? : UE;
  @Input() isEdit : boolean = false;

  selectedImage: string = '';
  selectedFile: File | null = null;
  defaultImage: string = '';

  constructor(private fb: FormBuilder, private elementRef : ElementRef,private imageServ: ImageService, private userService : UtilisateurService, private ueService : UeService) {}

  ngOnInit(): void {

    this.addUeForm = this.fb.group({
      code: [this.ue?.code ? this.ue.code : '',[Validators.required, Validators.pattern(/^[A-Z0-9]{4}$/)]],
      nom: [this.ue?.nom ? this.ue.nom : '', Validators.required],
      responsableId: [this.ue?.responsable_id ? this.ue.responsable_id : '', Validators.required],
      utilisateurs: [[]],
      file: [null],
      image: [this.ue?.images.nom_original ? this.ue.images.nom_original : ''],
    });



    this.defaultImage = this.ue?.images.nom_original ? this.ue.images.nom_original : 'default-ban.jpg';

    this.imageServ.getImageURL(this.defaultImage, 'ue').subscribe((res) => {
      this.selectedImage = res;
      this.imageServ.getImageData(this.defaultImage, 'ue').subscribe((res) => {

        this.addUeForm.patchValue({ image: {
            nom_original: res.filename,
            nom_stockage: res.path,
            extension: res.extension,
          } });
      })


    });

    this.userService.getAllUsers().subscribe({
      next: (users) => {
        const allUsers = (users as Utilisateur[]);
        this.userOptions = allUsers.map(user => ({
          name: `${user.prenom} ${user.nom}`,
          value: user.id_utilisateur.toString()
        }));

        // Maintenant traitez les utilisateurs sélectionnés
        if (this.ue) {
          const allAffectedUsers = [
            ...(this.ue.eleves_affectes || []),
            ...(this.ue.professeurs_affectes || [])
          ];

          allAffectedUsers.forEach(userId => {
            const user = allUsers.find(u => u.id_utilisateur === userId);
            if (user && !this.selectedUserValues.includes(user.id_utilisateur.toString())) {
              this.selectedUserValues.push(user.id_utilisateur.toString());
              this.selectedUserLabels.push(`${user.nom} ${user.prenom}`);
            }
          });
          this.addUeForm.patchValue({utilisateurs: this.selectedUserValues.map(val => parseInt(val))});
        }
      },
      error: err => console.log(err)
    });

    this.userService.getUsersByGroup(2).subscribe({
      next: data => {
        this.responsables = (data as Utilisateur[]);
      }
    })
  }

  get formValues() {
    return this.addUeForm.value;
  }

  onSubmit() {
    console.log(this.addUeForm.value);
    if (this.addUeForm.valid) {
      console.log('kawaine ! ')
      const newImage = this.addUeForm.get('image')?.value as FileModel;
      const shouldEditImage = this.isEdit && this.ue && this.ue.images.nom_original !== newImage.nom_original;

      console.log(shouldEditImage)


      if(!this.isEdit || shouldEditImage){
        if(this.addUeForm.get('image')?.value){
          if(this.ue && shouldEditImage){
            this.imageServ.remove(this.ue.images.nom_original, 'ue').subscribe((res) => {
              console.log(res);
            })
          }
          this.imageServ.uploadImage((this.selectedFile as File), 'ue').subscribe((res) => {
            this.addUeForm.patchValue({image : res})
          })
        }
      }
      const data : uePopup = {
        code : this.addUeForm.get('code')?.value,
        nom : this.addUeForm.get('nom')?.value,
        image : this.addUeForm.get('image')?.value,
        responsable_id : this.addUeForm.get('responsableId')?.value,
        utilisateurs_affectes : this.addUeForm.get('utilisateurs')?.value
      }

      if(this.isEdit && this.ue){
        this.ueService.editUE(data, this.ue.code).subscribe({
          next: (res) => {
            console.log(res)
            this.haveToEdit.emit();
            this.closePopup();
          }, error: err => console.log(err)
        })
      } else {

        this.ueService.addNewUe(data).subscribe({
          next: (res) => {
            console.log(res)
            this.haveToEdit.emit();
            this.closePopup();
          }, error: err => console.log(err)
        })

      }
    }
  }

  onImageSelected(file: File): void {
    this.selectedFile = file;

    const reader = new FileReader();
    reader.onload = (e) => {
      this.selectedImage = e.target?.result as string;
    };
    reader.readAsDataURL(file);

    this.addUeForm.patchValue({ image : {
        nom_original: file.name,
        nom_stockage: "",
        extension: file.type,
      } });

    this.addUeForm.patchValue({ file: file });
  }

  onUserSelectionChange(selectedOptions: Option[]) {
    this.selectedUserValues = selectedOptions.map(opt => opt.value);
    this.selectedUserLabels = selectedOptions.map(opt => opt.name);


    this.addUeForm.patchValue({ utilisateurs: this.selectedUserValues.map(val => parseInt(val)) });
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
    this.closePopupSignal.emit();
  }
}
