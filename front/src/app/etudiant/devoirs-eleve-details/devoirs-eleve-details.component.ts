import {Component, Input, OnChanges, OnInit} from '@angular/core';
import {Devoirs, Soumission} from '../../core/models/temp-publication.model';
import {DatePipe, NgStyle} from '@angular/common';
import {ActivatedRoute, Router} from '@angular/router';
import {EditSoumissionEleveComponent} from '../modal/edit-soumission-eleve/edit-soumission-eleve.component';
import {UeService} from '../../core/services/ue.service';
import {AuthService} from '../../core/services/auth.service';
import {FilesService} from '../../core/services/files.service';

@Component({
  selector: 'app-devoirs-eleve-details',
  imports: [
    DatePipe,
    EditSoumissionEleveComponent,
    NgStyle
  ],
  templateUrl: './devoirs-eleve-details.component.html',
  styleUrl: './devoirs-eleve-details.component.css'
})
export class DevoirsEleveDetailsComponent implements OnInit, OnChanges {
  devoir!: Devoirs;
  utilisateurId!: number;
  devoirId!: number;
  code!: string;
  secId!: number;
  soumissionExistante? : Soumission;
  openModal: boolean = false;


  constructor(private route: ActivatedRoute, private filesService : FilesService, private router: Router,private ueService : UeService, private authService : AuthService) {}

  ngOnChanges(): void {
    this.getExistingSoumission();
  }

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

    this.getExistingSoumission();
  }

  getExistingSoumission(){
    this.ueService.getSoumissionByUserId(this.code,this.secId,this.devoirId,this.utilisateurId).subscribe({
      next: value => {
        this.soumissionExistante = value;
      },
      error: err => {
        if (err.status === 404) {
          console.log('Aucune soumission pour cette élève')
        } else {
          console.error(err);
        }
      }
    })
  }


  fermerDepotModal() {
    this.openModal = false;
  }

  validerDepot() {
    this.getExistingSoumission();
    this.openModal = false;
  }

  backToEleve(){
    this.router.navigate(['/etudiant/contenu-ue',this.code]);
  }
  ouvrirDepotModal(){
    this.openModal = true;
  }

  openFile(filename : string) {
    // nom dans metadata (adapt-le si ta structure diffère)

    console.log(filename);

    if (!filename || !this.code) return;

    this.filesService.getFile(this.code, filename).subscribe({
      next: blob => {
        const url = URL.createObjectURL(blob);

        if (filename.toLowerCase().endsWith('.pdf')) {
          window.open(url, '_blank');
        } else {
          const a = document.createElement('a');
          a.href = url;
          a.download = filename;
          a.style.display = 'none';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        }
        URL.revokeObjectURL(url);
      },
      error: err => console.error('Erreur fichier :', err)
    });
  }
}
