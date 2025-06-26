import {Component, Input, OnInit} from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import {AuthService} from '../../../../core/services/auth.service';
import {UE} from '../../../../core/models/ue.model';
import {UtilisateurService} from '../../../../core/services/utilisateur.service';
import {ImageService} from '../../../../core/services/image.service';
import {Utilisateur} from '../../../../core/models/user.model';

@Component({
  selector: 'app-cours',
  imports: [
    RouterLink
  ],
  templateUrl: './cours.component.html',
  styleUrl: './cours.component.css'
})
export class CoursComponent implements OnInit {
  @Input() ue!: UE;

  responsable !: string ;
  realPathImage! : string;


  constructor(private router: Router,private authService: AuthService, private userService : UtilisateurService, private imageService : ImageService) {

  }

  ngOnInit() {
    this.userService.getUserById(this.ue.responsable_id).subscribe({
      next: (user)=> {
        this.responsable = (user as Utilisateur).nom + " " + (user as Utilisateur).prenom
      }, error: (e)=> {
        console.error(e);
      }
    })

    this.imageService.getImageURL(this.ue.images.nom_original, 'ues').subscribe({
      next: (image)=> {
        this.realPathImage = image
      },
      error: (e)=> {
        console.error(e);
      }
    })
  }

  changeRoute():void{
    this.router.navigate([this.authService.isProfesseur() ? 'professeur' : 'etudiant', 'contenu-ue', this.ue.code]);

  }


}
