import {Component, ElementRef, OnChanges, OnInit, ViewChild} from '@angular/core';
import {Message, Sujet} from '../../core/models/temp-publication.model';
import {ActivatedRoute, Router} from '@angular/router';
import {UeService} from '../../core/services/ue.service';
import {AuthService} from '../../core/services/auth.service';
import {DatePipe, NgClass} from '@angular/common';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {UtilisateurService} from '../../core/services/utilisateur.service';
import {Utilisateur} from '../../core/models/user.model';
import {ImageService} from '../../core/services/image.service';

@Component({
  selector: 'app-sujet-page',
  imports: [
    DatePipe,
    ReactiveFormsModule,
    NgClass,
  ],
  templateUrl: './sujet-page.component.html',
  styleUrl: './sujet-page.component.css'
})
export class SujetPageComponent implements OnInit, OnChanges {
  sujet!: Sujet;
  sujetId!: number;
  code!: string;
  secId!: number;
  forumId!: number;
  userId!: number;
  utilisateurNoms: { [id: number]: string } = {};


  formulaireMessage!: FormGroup;

  constructor(private route: ActivatedRoute, private userService : UtilisateurService,private fb : FormBuilder, private router : Router, private ueService : UeService, public authService :  AuthService, private imageService : ImageService) {}
  afficherFormulaireMessage: boolean = false;

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.sujetId = Number(idParam);
    }

    this.userId = this.authService.getIdUser();

    this.formulaireMessage = this.fb.group({
      contenu: ['', Validators.required],
    });

    const code = this.route.snapshot.paramMap.get('code');
    if (code) {
      this.code = code;
    }

    const secId = this.route.snapshot.paramMap.get('secId');
    if (secId) {
      this.secId = Number(secId);
    }

    const forumId = this.route.snapshot.paramMap.get('forumId');
    if (forumId) {
      this.forumId = Number(forumId);
    }

    if (this.code && this.secId && this.forumId && this.sujetId) {
      this.ueService.getSujetByForumAndId(this.code, this.secId, this.forumId, this.sujetId).subscribe({
        next: value => {
          this.sujet = value;
          this.listeMessages = value.messages;

          // Associer les images aux auteurs après chargement des messages
          this.listeMessages.forEach(message => {
            const auteurId = message.auteur_id;

            this.userService.getUserById(auteurId).subscribe(user => {
              const utilisateur = user as Utilisateur;

              // Charger le nom
              if (utilisateur) {
                this.utilisateurNoms[auteurId] = utilisateur.nom + ' ' + utilisateur.prenom;

                // Charger l'image
                if (utilisateur.image) {
                  this.imageService.getImageURL(utilisateur.image, 'profile').subscribe(imageUrl => {
                    this.utilisateurs_image[auteurId] = imageUrl;
                  });
                } else {
                  this.utilisateurs_image[auteurId] = 'assets/images/default-user.png'; // fallback image
                }
              } else {
                this.utilisateurNoms[auteurId] = 'Utilisateur inconnu';
                this.utilisateurs_image[auteurId] = 'assets/images/default-user.png';
              }
            });
          });
        },
        error: err => {
          console.error(err);
        }
      });
    }
  }


  utilisateurs_image: { [id: number]: string } = {};

   get_user_picture(userId : number) :string{
    if(!this.utilisateurs_image[userId]){

      this.userService.getUserById(userId).subscribe({
        next: (u) => {
          let user = u as Utilisateur;
          this.imageService.getImageURL(user.image, 'profile').subscribe(imageUrl => {
            this.utilisateurs_image[userId] = imageUrl;
          });
        },
        error: (err) => {}
      })

    }
    return this.utilisateurs_image[userId];
  }

  getUtilisateurNom(id: number): string {
    if(id){
      if (this.utilisateurNoms[id]) {
        return this.utilisateurNoms[id]; // Nom déjà chargé
      } else {
        this.userService.getUserById(id).subscribe({
          next: (user) => {
            const utilisateur = user as Utilisateur;
            if (utilisateur) {
              this.utilisateurNoms[id] = utilisateur.nom + ' ' + utilisateur.prenom;
            } else {
              this.utilisateurNoms[id] = 'Utilisateur inconnu';
            }
          },
          error: (err) => {
            console.error('Erreur récupération utilisateur', err);
            this.utilisateurNoms[id] = 'Erreur utilisateur';
          }
        });
      }
    }
    return 'Chargement...';


  }


  ngOnChanges(): void {
    this.loadMessages();
  }

  listeMessages!: Message[];


  loadMessages() {
    this.ueService.getMessagesForSujet(this.code, this.secId, this.forumId, this.sujetId).subscribe({
      next: (messages) => {
        this.listeMessages = messages;

        const ids = new Set<number>();
        messages.forEach((m : Message)  => ids.add(m.auteur_id));
        if (this.sujet?.auteur_id) ids.add(this.sujet.auteur_id);

        ids.forEach(id => {
          if (!this.utilisateurNoms[id]) {
            this.userService.getUserById(id).subscribe({
              next: (user) => {
                const u = user as Utilisateur;
                this.utilisateurNoms[id] = u?.nom + ' ' + u?.prenom;
              },
              error: () => {
                this.utilisateurNoms[id] = 'Utilisateur inconnu';
              }
            });
          }
        });
      },
      error: (err) => {
        console.error('Erreur lors du chargement des messages', err);
      }
    });
  }


  ajouterMessage() {
    this.afficherFormulaireMessage = !this.afficherFormulaireMessage;
  }

  backToClass(){
    this.router.navigate([this.authService.isProfesseur() ? 'professeur' : 'etudiant','forums',this.code,this.secId, this.forumId]);
  }
  envoyerMessage() {
    if(this.formulaireMessage.valid){
      const data : any = {contenu: this.formulaireMessage.get('contenu')?.value, auteur_id: this.userId }
      this.ueService.addMessage(this.code,this.secId, this.forumId, this.sujetId, data).subscribe({
        next: () => {
          this.loadMessages();
          this.formulaireMessage.reset();
          this.afficherFormulaireMessage = false;
        },
        error: (err) => {
          console.error(err);
        }
      })
    }
  }

  deleteMessage(messageId : number){
    this.ueService.deleteMessage(this.code,this.secId,this.forumId,this.sujetId,messageId).subscribe({
      next: () => {
        this.loadMessages();
      },
      error: (err) => {
        console.error(err);
      }
    })
  }

  @ViewChild('textareaAutoFocus') textareaAutoFocus!: ElementRef;

  ngAfterViewChecked() {
    if (this.afficherFormulaireMessage && this.textareaAutoFocus) {
      this.textareaAutoFocus.nativeElement.focus();
    }
  }
}
