import {Component, OnInit} from '@angular/core';
import {Utilisateur} from '../../core/models/user.model';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {UtilisateurService} from '../../core/services/utilisateur.service';
import {AuthService} from '../../core/services/auth.service';
import {ImageService} from '../../core/services/image.service';

@Component({
  selector: 'app-profile',
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  profilForm!: FormGroup;
  utilisateur! : Utilisateur;
  realImage! : string;

  constructor(private fb: FormBuilder, private utilisateurService : UtilisateurService, private authService : AuthService, private imageService : ImageService) {}

  ngOnInit(): void {
    this.utilisateurService.getUserById(this.authService.getIdUser()).subscribe({
      next: (user) => {
        this.utilisateur = user as Utilisateur;

        this.profilForm = this.fb.group({
          nom: [this.utilisateur.nom, Validators.required],
          prenom: [this.utilisateur.prenom, Validators.required],
          password: [this.utilisateur.mot_de_passe, Validators.required]
        });


        if(this.utilisateur && this.utilisateur.image){
          this.imageService.getImageURL(this.utilisateur.image, 'profile').subscribe(
            res => {
              this.realImage = res;
            }
          )
        }

      },
      error: (err) => {
        console.error(err);
      }
    })

  }

  editProfil(): void {
    if(this.profilForm.valid){

      const updatedData = this.profilForm.value;
      console.log('Modification utilisateur', updatedData);

      this.utilisateurService.editUser(updatedData, this.authService.getIdUser(), true).subscribe({
        next: value => {
         console.log('Modifié')
        }, error: err => {
          console.error(err);
        }

      })


    }
    // Appeler ici un service ou une API pour modifier l'utilisateur
  }
}
