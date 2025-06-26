import {Component, Input} from '@angular/core';
import {NotificationComponent} from '../notification/notification.component';
import {NotificationSite} from '../../../../core/models/temp-notification.model';

@Component({
  selector: 'app-actualites',
  imports: [
    NotificationComponent
  ],
  templateUrl: './actualites.component.html',
  styleUrl: './actualites.component.css'
})
export class ActualitesComponent {

  @Input() notifications: NotificationSite[] = [];
  @Input() showMoreButton = false;

  onAfficherPlus() {
    // Appelle ta logique ici (ex: événement ou service)
    console.log('Afficher plus de notifications...');
  }
}
