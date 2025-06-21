import {Component, OnInit} from '@angular/core';
import {ImageService} from '../../../core/services/image.service';
import {StatistiquesComponent} from '../../components/statistiques/statistiques.component';
import {UtilisateursComponent} from '../../components/utilisateurs/utilisateurs.component';
import {UeComponent} from '../../components/ue/ue.component';
import {UtilisateurService} from '../../../core/services/utilisateur.service';
import {Utilisateur} from '../../../core/models/user.model';
import {UE} from '../../../core/models/ue.model';
import {UeService} from '../../../core/services/ue.service';

@Component({
  selector: 'app-admin-dashboard',
  imports: [StatistiquesComponent, UeComponent, UtilisateursComponent],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent implements OnInit {

  imageUrl!:string;
  categorieUser:boolean = true;
  allUser!:Utilisateur[];
  allUes!:UE[];


  constructor(public imageserv: ImageService, private userService : UtilisateurService, private ueService : UeService) {
  }

  ngOnInit() : void {
    this.imageserv.getImageURL('mhammed.jpeg', 'profile').subscribe(res => {
      this.imageUrl = res;
    })

    this.userService.getAllUsers().subscribe( {
      next: (result) => {
        this.allUser = (result as Utilisateur[])
      },
        error: (err) => {
        console.log(err);
      }
    })

    this.ueService.getAllUEs().subscribe( {
      next: (result) => {
        this.allUes = (result as UE[]);
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  putUserAsCategorie() : void {
    if(!this.categorieUser)
    this.categorieUser = true;
  }

  putUEAsCategorie() : void {
    if(this.categorieUser)
      this.categorieUser = false;
  }



}
