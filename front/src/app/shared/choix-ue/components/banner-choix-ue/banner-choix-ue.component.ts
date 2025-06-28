import {Component, Input, OnInit} from '@angular/core';
import {Utilisateur} from '../../../../core/models/user.model';
import {RoleFormatterPipe} from '../../../../core/RolePipe/role-formatter.pipe'
import {ImageService} from '../../../../core/services/image.service';

@Component({
  selector: 'app-banner-choix-ue',
  imports: [RoleFormatterPipe],
  templateUrl: './banner-choix-ue.component.html',
  styleUrl: './banner-choix-ue.component.css'
})
export class BannerChoixUeComponent implements OnInit {

  constructor(private imageService : ImageService) {
  }
  @Input() utilisateur!: Utilisateur;
  realImage! : string;

  ngOnInit() {
    if(this.utilisateur){
      this.imageService.getImageURL(this.utilisateur.image, 'profile').subscribe(image => {
        this.realImage = image;
      })
    }
  }

}
