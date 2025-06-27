import {Component, Input, OnInit} from '@angular/core';
import {Devoirs, Soumission} from '../../core/models/temp-publication.model';
import {DatePipe} from '@angular/common';
import {ActivatedRoute, Router} from '@angular/router';
import {EditSoumissionEleveComponent} from '../modal/edit-soumission-eleve/edit-soumission-eleve.component';
import {UeService} from '../../core/services/ue.service';
import {AuthService} from '../../core/services/auth.service';

@Component({
  selector: 'app-devoirs-eleve-details',
  imports: [
    DatePipe,
    EditSoumissionEleveComponent
  ],
  templateUrl: './devoirs-eleve-details.component.html',
  styleUrl: './devoirs-eleve-details.component.css'
})
export class DevoirsEleveDetailsComponent implements OnInit {
  devoir!: Devoirs;
  utilisateurId!: number;
  devoirId!: number;
  code!: string;
  secId!: number;


  constructor(private route: ActivatedRoute, private router: Router,private ueService : UeService, private authService : AuthService) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.devoirId = Number(idParam);
    }

    this.utilisateurId = this.authService.getIdUser();

    const code = this.route.snapshot.paramMap.get('code');
    if (code){
      this.code = code;
    }

    const secId = this.route.snapshot.paramMap.get('secId');
    if (secId){
      this.secId = Number(secId);
    }

    if(this.code && this.secId && this.devoirId){
      this.ueService.getDevoirBySectionAndId(this.code, this.secId,this.devoirId).subscribe({
        next: value => {
          this.devoir = value;
        },
        error: err => {
          console.error(err);
        }
      })

    }
  }


  get soumissionExistante(): Soumission | undefined {
    return this.devoir?.soumissions?.find(
      (s) => s.etudiant_id === this.utilisateurId
    );
  }

  // modal depot travail de eleve

  soumissionDepot?: Soumission;

  ouvrirDepotModal() {
    this.soumissionDepot = {
      _id: Date.now(),
      etudiant_id: this.utilisateurId,
      date_soumission: '',
      statut: '',
      fichiers: {
        nom_original: '',
        nom_stockage: '',
        extension: ''
      },
      note: 0,
      commentaire_prof: '',
      correcteur_id: 0,
      date_correction: ''
    };
  }

  fermerDepotModal() {
    this.soumissionDepot = undefined;
  }

  validerDepot(soumission: Soumission) {
    this.devoir.soumissions?.push(soumission);
  }

  backToEleve(){
    this.router.navigate(['/etudiant/contenu-ue',this.code]);
  }

}
