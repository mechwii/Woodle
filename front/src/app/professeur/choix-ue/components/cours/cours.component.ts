import {Component, Input} from '@angular/core';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-cours',
  imports: [
    RouterLink
  ],
  templateUrl: './cours.component.html',
  styleUrl: './cours.component.css'
})
export class CoursComponent {
  @Input() ue: any;
  @Input() userRoles: string[] = [];

  get isEleve(): boolean {
    return this.userRoles.includes('ROLE_ELEVE');
  }

  get route(): string {
    return this.isEleve ? `/etudiant/${this.ue.code}` : `/professeur/${this.ue.code}`;
  }
}
