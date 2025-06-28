import {Component, Input, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from '../../../../core/services/auth.service';
import {UE} from '../../../../core/models/ue.model';
import {UtilisateurService} from '../../../../core/services/utilisateur.service';
import {ImageService} from '../../../../core/services/image.service';
import {Utilisateur} from '../../../../core/models/user.model';
import {UeService} from '../../../../core/services/ue.service';

@Component({
  selector: 'app-cours',
  imports: [

  ],
  templateUrl: './cours.component.html',
  styleUrl: './cours.component.css'
})
export class CoursComponent implements OnInit {
  @Input() ue!: UE;

  responsable !: string ;
  realPathImage! : string;
  progression!: number;
  nbEtudiants!:number;

  constructor(private router: Router, private ueService : UeService,public authService: AuthService, private userService : UtilisateurService, private imageService : ImageService) {

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

    if(this.authService.isProfesseur()){
      this.ueService.getUserInUEByGroup(this.ue.code, 3).subscribe({
        next: (users)=> {
          this.nbEtudiants = users.length;
        },
        error: (e)=> {
          console.error(e);
        }
      })
    }

    if(this.authService.isEtudiant()){
      this.ueService.getStat(this.ue.code, this.authService.getIdUser()).subscribe({
        next: (stat)=> {
          this.progression = stat.pourcentage;
        },
        error: (e)=> {
          console.error(e);
        }
      }
      )
    }

  }

  changeRoute():void{
    this.router.navigate([this.authService.isProfesseur() ? 'professeur' : 'etudiant', 'contenu-ue', this.ue.code]);

  }


}
