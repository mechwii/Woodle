import {Component, Input, OnInit} from '@angular/core';
import {AuthService} from '../../../core/services/auth.service';
import {Router, RouterModule} from '@angular/router';
import {ImageService} from '../../../core/services/image.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {

  constructor(private authServ : AuthService, private router: Router, public imageserv: ImageService) {
  }

  isProfAndAdmin!: boolean ;
  showProfileMenu = false;
  showRoleMenu = false;
  imgUrl!:string;

  ngOnInit() : void {
    this.isProfAndAdmin = this.authServ.isAdminAndProfesseur();

    console.log('vueActive:', this.vueActive);
    console.log('isProfAndAdmin:', this.isProfAndAdmin);
    console.log('showProfileMenu:', this.showProfileMenu);
    this.imageserv.getImageURL('mhammed.jpeg', 'profile').subscribe((res) => {
      this.imgUrl = res;
    })

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
