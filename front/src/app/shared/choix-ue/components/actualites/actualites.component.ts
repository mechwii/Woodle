import {Component, Input} from '@angular/core';
import {NotificationComponent} from '../notification/notification.component';
import {Notifications} from '../../../../core/models/notifications';

@Component({
  selector: 'app-actualites',
  imports: [
    NotificationComponent
  ],
  templateUrl: './actualites.component.html',
  styleUrl: './actualites.component.css'
})
export class ActualitesComponent {

  @Input() notifications: Notifications[] = [];
  @Input() showMoreButton = false;

}
