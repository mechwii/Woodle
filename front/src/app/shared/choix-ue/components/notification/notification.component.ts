import {Component, Input} from '@angular/core';
import {NgClass} from '@angular/common';

@Component({
  selector: 'app-notification',
  imports: [
    NgClass
  ],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.css'
})
export class NotificationComponent {
  @Input() notification!: any;

  get classes(): string[] {
    const classes: string[] = [];

    switch (this.notification.type_notification_id) {
      case 1:
        classes.push('affectation');
        break;
      case 5:
        classes.push('fichier');
        break;
      default:
        classes.push('message');
    }

    if (this.notification.priorite_id === 2) {
      classes.push('important-notif');
    }

    return classes;
  }

  removeUrgentNotif(id: number) {
    console.log('Suppression de la notif urgente avec ID', id);
    // Implémente la logique ici
  }
}
