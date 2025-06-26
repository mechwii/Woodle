import {Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output} from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { DropZoneComponent } from '../../drop-zone/drop-zone.component';
import { MultiselectComponent, Option } from '../../multiselect/multiselect.component';
import { UE } from '../../../../core/models/ue.model';
import { Roles } from '../../../../core/models/auth.model';
import { ImageService } from '../../../../core/services/image.service';
import {UeService} from '../../../../core/services/ue.service';
import {userPopupForm, Utilisateur} from '../../../../core/models/user.model';
import {UtilisateurService} from '../../../../core/services/utilisateur.service';
import {FileModel} from '../../../../core/models/file.model';

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

  defaultPicture!: string;

  selectedImage: string = '';
  selectedFile: File | null = null;

  @Output() closePopupSignal = new EventEmitter();
  @Input() user? : Utilisateur;
  @Input() isEdit : boolean = false;
  @Output() shouldUpdate = new EventEmitter();

  ueOptions: Option[] = [];

  selectedUeValues: string[] = [];


  constructor(private fb: FormBuilder, private elementRef : ElementRef,private imageServ: ImageService, private ueService : UeService, private userService : UtilisateurService) {}

  ngOnInit(): void {
    this.userService.getAllRoles().subscribe(roles => {
      this.roles = roles;

    })

    this.addUserForm = this.fb.group({
      nom: [this.user?.nom ? this.user.nom : '', Validators.required],
      prenom: [this.user?.prenom ? this.user.prenom : '', Validators.required],
      email: [this.user?.email ? this.user.email : '', [Validators.required, Validators.email]],
      password: [this.user?.mot_de_passe ? this.user.mot_de_passe : '', Validators.required],
      roles: this.fb.array([]),
      ues: [[]],
      utilisateurs: [[]],
      file: [null],
      picture: [this.user?.image ? this.user.image : '']
    });

    if (this.user && this.user.roles) {
      const rolesArray = this.addUserForm.get('roles') as FormArray;
      this.user.roles.forEach(role => {
        rolesArray.push(this.fb.control(role.id_role));
      });
    }

    this.defaultPicture = this.user?.image ? this.user.image : 'default.jpg';

    this.imageServ.getImageURL(this.defaultPicture, 'profile').subscribe(res => {
      this.selectedImage = res;
    });

    if(this.user){
      this.ueService.getAllUeForUserId(this.user.id_utilisateur, 'admin_data').subscribe(res => {
        const ues = res as UE[];
        this.addUserForm.patchValue({ ues: ues.map(ue => ue.code) });
        this.selectedUeValues = ues.map(ue => ue.code);
      })
    }


    this.ueService.getAllUEs().subscribe({
      next: (res) => {
        this.ueOptions = (res as UE[]).map(ue => ({
          value: ue.code,
          name: ue.nom
        }));
      },
      error: (err) => {
        console.log(err);
      }
    });
  }



  get formValues() {
    return this.addUserForm.value;
  }

  onSubmit(): void {
    if(this.addUserForm.valid) {

      const shouldUpdateImage = this.user && this.user.image !== this.addUserForm.get('picture')?.value

      if(!this.isEdit || this.isEdit && this.shouldUpdate ){
        if(this.addUserForm.get('picture')?.value){
          if(this.user && shouldUpdateImage ){
            this.imageServ.remove(this.user.image, 'profile').subscribe(res => {
              console.log(res);
            });
          }
          this.imageServ.uploadImage((this.selectedFile as File), 'profile').subscribe(res => {
            console.log(res);
            this.addUserForm.patchValue({ picture: res.filename });
          })
        } else {
          this.addUserForm.patchValue({ picture: 'default.jpg' });
        }
      }


      const data : userPopupForm = {
        nom : this.addUserForm.get('nom')?.value,
        prenom: this.addUserForm.get('prenom')?.value,
        email: this.addUserForm.get('email')?.value,
        image: this.addUserForm.get('picture')?.value,
        password : this.addUserForm.get('password')?.value,
        roles : this.addUserForm.get('roles')?.value,
        UE : this.addUserForm.get('ues')?.value,
      }

      console.log(data)

      if(!this.isEdit){
        this.userService.createUser(data).subscribe( {
          next: (res) => {
            console.log(res);
            this.shouldUpdate.emit();
            this.closePopupSignal.emit();
          }, error : (res) => {
            console.log(res);
          }

        })
      } else {
        if(this.user){
          this.userService.editUser(data,this.user.id_utilisateur).subscribe( {
            next: (res) => {
              console.log(res);
              this.shouldUpdate.emit();
              this.closePopupSignal.emit();

            }, error : (res) => {
              console.log(res);
            }

          })
        }


      }


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

    this.addUserForm.patchValue({ picture: file.name });


    this.addUserForm.patchValue({ file: file });
  }

  isRoleSelected(roleId: number): boolean {
    const rolesFormArray = this.addUserForm.get('roles') as FormArray;
    return rolesFormArray.controls.some(ctrl => ctrl.value === roleId);
  }


  resetUpload(): void {
    this.selectedImage = '';
    this.selectedFile = null;
    this.addUserForm.patchValue({ file: null });
  }

  onRoleToggle(roleId: number, isChecked: boolean): void {
    const rolesFormArray = this.addUserForm.get('roles') as FormArray;

    if (isChecked) {
      // Add the role ID to the array if checked
      rolesFormArray.push(this.fb.control(roleId));
    } else {
      // Remove the role ID from the array if unchecked
      const index = rolesFormArray.controls.findIndex(ctrl => ctrl.value === roleId);
      if (index >= 0) {
        rolesFormArray.removeAt(index);
      }
    }
  }

  // --- MULTISELECT UE ---
  onUeSelectionChange(selectedOptions: Option[]): void {
    this.selectedUeValues = selectedOptions.map(opt => opt.value);

    this.addUserForm.patchValue({ ues: this.selectedUeValues });

    console.log(this.selectedUeValues);

    console.log(this.selectedUeValues);

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
