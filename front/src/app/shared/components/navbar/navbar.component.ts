import {Component, Input, OnInit} from '@angular/core';
import {AuthService} from '../../../core/services/auth.service';
import {Router, RouterModule} from '@angular/router';
import {ImageService} from '../../../core/services/image.service';
import {UtilisateurService} from '../../../core/services/utilisateur.service';
import {Utilisateur} from '../../../core/models/user.model';

@Component({
  selector: 'app-navbar',
  imports: [RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {

  constructor(private authServ : AuthService, private router: Router, public imageserv: ImageService, private userService : UtilisateurService) {
  }

  isProfAndAdmin!: boolean ;
  showProfileMenu = false;
  showRoleMenu = false;
  imgUrl!:string;
  realImage!:string;

  ngOnInit() : void {
    this.isProfAndAdmin = this.authServ.isAdminAndProfesseur();

    console.log('vueActive:', this.vueActive);
    console.log('isProfAndAdmin:', this.isProfAndAdmin);
    console.log('showProfileMenu:', this.showProfileMenu);


    this.userService.getUserById(this.authServ.getIdUser()).subscribe(
      user => {
        this.imageserv.getImageURL((user as Utilisateur).image, 'profile').subscribe((res) => {
          this.imgUrl = res;
        })
      }
    )

  }
  @Input() vueActive! : string;



  toggleProfileMenu() {
    this.showProfileMenu = !this.showProfileMenu;
    if(this.showRoleMenu){
      this.showRoleMenu = false;
    }
  }

  toggleRoleMenu() {
    this.showRoleMenu = !this.showRoleMenu;
    if(this.showProfileMenu){
      this.showProfileMenu = false;
    }
  }

  logout() {
    this.authServ.logout();
    this.router.navigate(['login']);
  }

  getProfilRoute(): string {
    switch (this.vueActive) {
      case 'admin':
        return '/admin/profil';
      case 'professeur':
        return '/professeur/profil';
      default:
        return '/etudiant/profil';
    }
  }

}
