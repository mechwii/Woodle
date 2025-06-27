import {Component, OnInit} from '@angular/core';
import {Message, Sujet} from '../../core/models/temp-publication.model';
import {ActivatedRoute, Router} from '@angular/router';
import {UeService} from '../../core/services/ue.service';
import {AuthService} from '../../core/services/auth.service';
import {DatePipe} from '@angular/common';
import {AddSujetComponent} from '../forum-page/modal/add-sujet/add-sujet.component';

@Component({
  selector: 'app-sujet-page',
  imports: [
    DatePipe,
  ],
  templateUrl: './sujet-page.component.html',
  styleUrl: './sujet-page.component.css'
})
export class SujetPageComponent implements OnInit {
  sujet!: Sujet;
  sujetId!: number;
  code!: string;
  secId!: number;
  forumId!: number;

  constructor(private route: ActivatedRoute, private router : Router, private ueService : UeService, public authService :  AuthService) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.sujetId = Number(idParam);
    }

    const code = this.route.snapshot.paramMap.get('code');
    if (code){
      this.code = code;
    }

    const secId = this.route.snapshot.paramMap.get('secId');
    if (secId){
      this.secId = Number(secId);
    }

    const forumId = this.route.snapshot.paramMap.get('forumId');
    if (forumId){
      this.forumId = Number(forumId);
    }

    if(this.code && this.secId && this.forumId && this.sujetId){
      this.ueService.getSujetByForumAndId(this.code, this.secId,this.forumId, this.sujetId).subscribe({
        next: value => {
          this.sujet = value;
        },
        error: err => {
          console.error(err);
        }
      })

    }

    this.loadMessages();
  }

  listeMessages!: Message[];


  loadMessages() {
    this.ueService.getMessagesForSujet(this.code,this.secId, this.forumId, this.sujetId).subscribe({
      next: (messages) => {
        this.listeMessages = messages;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des messages', err);
      }
    })
  }

  ajouterMessage() {

  }


}
