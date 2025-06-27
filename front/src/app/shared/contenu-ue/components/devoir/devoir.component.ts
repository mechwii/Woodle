import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {DatePipe} from '@angular/common';
import {Devoirs} from '../../../../core/models/temp-publication.model';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../../../../core/services/auth.service';
import {UeService} from '../../../../core/services/ue.service';

@Component({
  selector: 'app-devoir',
  imports: [
    DatePipe
  ],
  templateUrl: './devoir.component.html',
  styleUrl: './devoir.component.css'
})
export class DevoirComponent implements OnInit{
  @Input() devoir!: Devoirs;
  @Input() secId! :number
  codeUe! : string

  ngOnInit() {
    this.codeUe = this.activatedRoute.snapshot.params['code']
  }

  @Output() hasDeleted: EventEmitter<void> = new EventEmitter<void>();

  constructor(private router: Router, private activatedRoute : ActivatedRoute,public authService : AuthService, public ueService : UeService) {}

  voirDepots(): void {
    this.router.navigate(['/professeur/devoirs',this.codeUe, this.secId , this.devoir._id]);
  }

  deposerDevoir() {
    this.router.navigate(['/etudiant/devoirs',this.codeUe, this.secId, this.devoir._id]);
  }

  deleteDevoir(){
    if(this.devoir && this.devoir._id){
      this.ueService.deleteDevoir(this.codeUe,this.secId,this.devoir._id ).subscribe({
        next: () => {
          this.hasDeleted.emit();
        },
        error: (err) => {
          console.error(err);
        }
      })
    }


  }
}
