import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Roles} from '../../../core/models/auth.model';
import {ImageService} from '../../../core/services/image.service';
import {RoleFormatterPipe} from '../../../core/RolePipe/role-formatter.pipe';
import {AuthService} from '../../../core/services/auth.service';
import {Utilisateur} from '../../../core/models/user.model';

@Component({
  selector: 'app-utilisateurs',
  imports: [RoleFormatterPipe],
  templateUrl: './utilisateurs.component.html',
  styleUrl: './utilisateurs.component.css'
})
export class UtilisateursComponent implements OnInit {
  /*
  @Input() id_utilisateur!: number;
  @Input() nom_utilisateur!: string;
  @Input() prenom_utilisateur!: string;
  @Input() roles_utilisateur! : Roles[];
  @Input() image_url!: string;/*
   */

  @Input() utilisateur!: Utilisateur;
  @Output() editUtilisateur = new EventEmitter();
  @Output() deleteUtilisateur = new EventEmitter();

  imageRealUrl!: string;

  id_user_connected! : number; // pour ne pas pouvoir l'edit ou le supprimer

  constructor(private imageService: ImageService, private authService: AuthService) {
  }

  ngOnInit() :void {
    this.imageService.getImageURL(this.utilisateur.image, 'profile').subscribe(image => {
      this.imageRealUrl = image;
    })

    this.id_user_connected = this.authService.getIdUser();
  }

  sendDelete(): void {
    this.deleteUtilisateur.emit(this.id_user_connected);
  }

  sendEditUtilisateur(): void {
    this.editUtilisateur.emit(this.id_user_connected);
  }
}
