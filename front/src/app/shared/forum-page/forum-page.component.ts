import {Component, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {Forum, Sujet} from '../../core/models/temp-publication.model';
import {ActivatedRoute, Router} from '@angular/router';
import {DatePipe, SlicePipe} from '@angular/common';
import {UeService} from '../../core/services/ue.service';
import {AuthService} from '../../core/services/auth.service';
import {AddSujetComponent} from './modal/add-sujet/add-sujet.component';

@Component({
  selector: 'app-forum-page',
  imports: [
    DatePipe,
    AddSujetComponent,
    SlicePipe
  ],
  templateUrl: './forum-page.component.html',
  styleUrl: './forum-page.component.css'
})
export class ForumPageComponent implements OnInit, OnChanges {
  forum!: Forum;
  forumId?: number;
  code!: string;
  secId!: number;

  // sujets

  ngOnChanges(changes: SimpleChanges) {
    this.loadSujets();
  }

  constructor(private route: ActivatedRoute, private router : Router, private ueService : UeService, public authService :  AuthService) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.forumId = Number(idParam);
    }

    const code = this.route.snapshot.paramMap.get('code');
    if (code){
      this.code = code;
    }

    const secId = this.route.snapshot.paramMap.get('secId');
    if (secId){
      this.secId = Number(secId);
    }

    if(this.code && this.secId && this.forumId){
      this.ueService.getForumBySectionAndId(this.code, this.secId,this.forumId).subscribe({
        next: value => {
          this.forum = value;
        },
        error: err => {
          console.error(err);
        }
      })

    }

    this.loadSujets();
  }

  // sujets


  listeSujets!: Sujet[];


  loadSujets() {
    this.ueService.getSujetsForForum(this.code,this.secId, this.forumId).subscribe({
      next: (sujets) => {
        this.listeSujets = sujets;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des sujets', err);
      }
    })
  }



  // forum modal

  modalSujetVisible = false;

  openAddSujetModal() {
    this.modalSujetVisible = true;
  }

  onCloseSujetModal() {
    this.modalSujetVisible = false;
  }

  onAddSujet() {
    this.loadSujets();
    console.log('update')
  }

  voirSujet(sujetId: any) {
    const espace = this.authService.isProfesseur() ? 'professeur' : 'etudiant';
    this.router.navigate([espace,'forums',this.code, this.secId , this.forumId, sujetId]);
    console.log(this.forumId);
  }

  deleteSujet(sujetId : any){
    this.ueService.deleteSujet(this.code,this.secId,this.forumId,sujetId).subscribe({
      next: () => {
        this.loadSujets();
      },
      error: (err) => {
        console.error(err);
      }
    })
  }

  backToClass(){
    this.router.navigate([this.authService.isProfesseur() ? 'professeur' : 'etudiant','contenu-ue',this.code]);
  }
}
