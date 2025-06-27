import {Component, OnInit} from '@angular/core';
import {Devoirs, Soumission} from '../../core/models/temp-publication.model';
import {ActivatedRoute, Router} from '@angular/router';
import {DatePipe} from '@angular/common';
import {EditSoumissionComponent} from '../modal/edit-soumission/edit-soumission.component';
import {UeService} from '../../core/services/ue.service';

@Component({
  selector: 'app-devoirs-depots-details',
  imports: [
    DatePipe,
    EditSoumissionComponent
  ],
  templateUrl: './devoirs-depots-details.component.html',
  styleUrl: './devoirs-depots-details.component.css'
})
export class DevoirsDepotsDetailsComponent implements OnInit {
  devoirs!: Devoirs;
  devoirId?: number;
  code!: string;
  secId!: number;

  constructor(private route: ActivatedRoute, private router : Router, private ueService : UeService) {}


  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.devoirId = Number(idParam);
    }

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
          this.devoirs = value;
        },
        error: err => {
          console.error(err);
        }
      })

    }

  }

  // modal modif soumission
  soumissionEnCours?: Soumission | null = null;

  onModifierSoumission(soumission: Soumission) {
    this.soumissionEnCours = { ...soumission }; // clone si nécessaire
  }

  onFermerModal() {
    this.soumissionEnCours = null;
  }

  backToProf(){
    this.router.navigate(['/professeur/contenu-ue',this.code]);
  }

  onValiderSoumission(modifiee: Soumission) {
    // Mise à jour locale, ou appel API
    const index = this.devoirs.soumissions?.findIndex(s => s._id === modifiee._id);
    if (index !== undefined && index > -1 && this.devoirs.soumissions) {
      this.devoirs.soumissions[index] = modifiee;
    }
  }
}
