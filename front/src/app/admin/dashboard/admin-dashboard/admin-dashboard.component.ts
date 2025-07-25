import {Component, OnInit} from '@angular/core';
import {ImageService} from '../../../core/services/image.service';
import {StatistiquesComponent} from '../../components/statistiques/statistiques.component';
import {UtilisateursComponent} from '../../components/utilisateurs/utilisateurs.component';
import {UeComponent} from '../../components/ue/ue.component';
import {UtilisateurService} from '../../../core/services/utilisateur.service';
import {Utilisateur} from '../../../core/models/user.model';
import {UE} from '../../../core/models/ue.model';
import {UeService} from '../../../core/services/ue.service';

import { FormsModule } from '@angular/forms';
import {AddEditUserComponent} from '../../components/modal/add-edit-user/add-edit-user.component';
import {DeleteUeUserComponent} from '../../components/modal/delete-ue-user/delete-ue-user.component';
import {AddEditUeComponent} from '../../components/modal/add-edit-ue/add-edit-ue.component';
import {AuthService} from '../../../core/services/auth.service';
import {RoleFormatterPipe} from '../../../core/RolePipe/role-formatter.pipe';
import {Statistiques} from '../../../core/models/statistiques.model';

export interface PopupState {
  target : string;
  data : Utilisateur| UE | null;
}

@Component({
  selector: 'app-admin-dashboard',
  imports: [StatistiquesComponent, UeComponent, UtilisateursComponent, FormsModule, AddEditUserComponent, DeleteUeUserComponent, AddEditUeComponent, RoleFormatterPipe],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent implements OnInit {

  imageUrl!:string;
  categorieUser:boolean = true;
  allUser!:Utilisateur[];
  allUes!:UE[];
  stat! : Statistiques;


  filterText: string = '';
  filteredUsers!:Utilisateur[];
  filteredUes!:UE[];

  UtilisateurEdit?: Utilisateur;
  UeEdit?: UE;


  currentUser! : Utilisateur;

  popupState : PopupState= {
    target: '', // 'user' | 'ue'
    data: null // objet à éditer, s’il y a lieu
  }


// EMETTEUR DES ENFANTS DISENT DE SUPPRIMER

  constructor(public imageserv: ImageService, private userService : UtilisateurService, private ueService : UeService, private authService : AuthService) {
  }

  ngOnInit() : void {

    this.userService.getUserById(this.authService.getIdUser()).subscribe(res => {
      this.currentUser = (res as Utilisateur)
      this.imageserv.getImageURL(this.currentUser.image, 'profile').subscribe(res => {
        this.imageUrl = res;
      })

    })


    this.initializeUsersAndUE()

  }

  initializeUsersAndUE() : void {
    this.allUser = []
    this.allUes = []
    this.userService.getAllUsers().subscribe( {
      next: (result) => {
        this.allUser = (result as Utilisateur[])
        this.filteredUsers = [...this.allUser];
      },
      error: (err) => {
        console.log(err);
      }
    })

    this.ueService.getAllUEs().subscribe( {
      next: (result) => {
        console.log(result)
        this.allUes = (result as UE[]);
        this.filteredUes = [...this.allUes];
      },
      error: (err) => {
        console.log(err);
      }
    })

    this.userService.getStatistiques().subscribe({
      next: (result) => {
        this.stat = (result as Statistiques);

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

  onFilterChange(): void {
    this.filterText = this.filterText.toLowerCase().trim();

    if (this.categorieUser) {
      this.filteredUsers = this.filterText
        ? this.allUser.filter(u =>
          `${u.nom} ${u.prenom}`.toLowerCase().includes(this.filterText)
        )
        : [...this.allUser];
    } else {
      this.filteredUes = this.filterText
        ? this.allUes.filter(ue =>
          `${ue.code} ${ue.nom}`.toLowerCase().includes(this.filterText)
        )
        : [...this.allUes];
    }
  }

  openAddModalPopup() : void {
    this.popupState.target = this.categorieUser ? 'add-user' : 'add-ue';
  }

  closeAllPopup() : void {
    this.popupState.target= '';
    this.popupState.data = null;
  }

  openEditUserModalPopup(id : number) : void {
    this.userService.getUserById(id).subscribe((user) => {
      console.log(user)
      this.UtilisateurEdit = (user as Utilisateur);
      this.popupState.target = 'edit-user'
    });
  }

  openDeleteUserModal(id : number) : void {
    this.popupState.target = 'delete-ue';

    this.userService.getUserById(id).subscribe((user) => {
      console.log(user)
      this.UtilisateurEdit = (user as Utilisateur);
      this.popupState.target = 'delete-user'
    });

  }

  openDeleteUeModal(code :string) : void{
    this.ueService.getUeByCode(code).subscribe({
      next: (result) => {
        console.log(result);
        this.UeEdit = (result as UE)
        this.popupState.target = 'delete-ue';
      }, error: (err) => {
        console.log(err);
      }
    })
  }

  openEditUesModalPopup(code :string) : void {
    console.log('debut edit')
    this.ueService.getUeByCode(code).subscribe({
      next: (result) => {
        console.log(result);
        this.UeEdit = (result as UE)
        this.popupState.target = 'edit-ue';
      }, error: (err) => {
        console.log(err);
      }
    })
  }

  getUEData() : UE {
    return (this.popupState.data as UE)
  }


}
