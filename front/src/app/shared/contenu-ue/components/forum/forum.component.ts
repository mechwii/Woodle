import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Devoirs, Forum} from '../../../../core/models/temp-publication.model';
import {AuthService} from '../../../../core/services/auth.service';
import {UeService} from '../../../../core/services/ue.service';

@Component({
  selector: 'app-forum',
  imports: [],
  templateUrl: './forum.component.html',
  styleUrl: './forum.component.css'
})
export class ForumComponent implements OnInit {
  @Input() forum!: Forum;
  @Input() secId! :number
  codeUe! : string

  constructor(private router: Router, private activatedRoute : ActivatedRoute,public authService : AuthService, public ueService : UeService) {}

  allerAuForum() {
    if (this.authService.isProfesseur()) {
      this.router.navigate(['/professeur/forums',this.codeUe, this.secId , this.forum._id]);
    } else if (this.authService.isEtudiant()) {
      this.router.navigate(['/etudiant/forums',this.codeUe, this.secId , this.forum._id]);
    }
  }

  ngOnInit() {
    this.codeUe = this.activatedRoute.snapshot.params['code']
  }

  @Output() hasDeleted: EventEmitter<void> = new EventEmitter<void>();

  deleteForum(){
    if(this.forum && this.forum._id){
      this.ueService.deleteForum(this.codeUe,this.secId,this.forum._id ).subscribe({
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
