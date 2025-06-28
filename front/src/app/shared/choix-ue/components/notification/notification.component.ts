import {Component, Input, OnInit} from '@angular/core';
import {NgClass} from '@angular/common';
import {Utilisateur} from '../../../../core/models/user.model';
import {Notifications} from '../../../../core/models/notifications';
import {UtilisateurService} from '../../../../core/services/utilisateur.service';
import {Router} from '@angular/router';
import {AuthService} from '../../../../core/services/auth.service';

@Component({
  selector: 'app-notification',
  imports: [
    NgClass
  ],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.css'
})
export class NotificationComponent implements OnInit{
  @Input() notification!: Notifications;

  constructor(private  userService : UtilisateurService) {
  }

  codeUe! : string;
  emetteur!: Utilisateur;
  type_notification!: string;

  ngOnInit() {
    this.codeUe = this.notification.code_matiere;
    this.type_notification = this.notification.type_notification;

    this.userService.getUserById(this.notification.emetteur_id).subscribe({
      next: (user)=> {
        this.emetteur = (user as Utilisateur);
      }, error: (e)=> {
        console.error(e);
      }
    })
  }

  get classes(): string[] {
    const classes: string[] = [];

    switch (this.notification.type_notification) {
      case 'affectation':
        classes.push('affectation');
        break;
      case 'correction_devoir':
        classes.push('corrige');
        break;
        case 'soumission_devoir':
          classes.push('fichier');
          break;
      case 'publication':
        classes.push('message');
        break;
      default:
        classes.push('message');
    }

    return classes;
  }

  get getMessage() : string {
    let message = ''
    switch (this.notification.type_notification) {
      case 'affectation':
       message = " vous a ajouté à l'UE ";
       break
      case 'correction_devoir':
        message = " a corrigé votre devoir dans "
        break;
        case 'soumission_devoir':
          message = " a soumis un devoir dans "
        break;
          case 'publication':
            message = " a ajouté une nouvelle publication dans "
        break;
      default:
        message = "a"
    }


    return message
  }



}
