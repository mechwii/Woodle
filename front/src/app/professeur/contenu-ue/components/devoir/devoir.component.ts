import {Component, Input} from '@angular/core';
import {DatePipe} from '@angular/common';
import {Devoirs} from '../../../../core/models/temp-publication.model';
import {Router} from '@angular/router';
import {AuthService} from '../../../../core/services/auth.service';

@Component({
  selector: 'app-devoir',
  imports: [
    DatePipe
  ],
  templateUrl: './devoir.component.html',
  styleUrl: './devoir.component.css'
})
export class DevoirComponent {
  @Input() devoir!: Devoirs;
  constructor(private router: Router, public authService : AuthService) {}

  voirDepots(): void {
    this.router.navigate(['/professeur/devoirs', this.devoir._id]);
  }

  deposerDevoir() {
    this.router.navigate(['/etudiant/devoirs', this.devoir._id]);
  }
}
