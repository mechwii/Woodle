import {Component, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {Devoirs, Soumission} from '../../core/models/temp-publication.model';
import {ActivatedRoute, Router} from '@angular/router';
import {DatePipe, NgStyle} from '@angular/common';
import {EditSoumissionComponent} from '../modal/edit-soumission/edit-soumission.component';
import {UeService} from '../../core/services/ue.service';
import {FilesService} from '../../core/services/files.service';

@Component({
  selector: 'app-devoirs-depots-details',
  imports: [
    DatePipe,
    EditSoumissionComponent,
    NgStyle
  ],
  templateUrl: './devoirs-depots-details.component.html',
  styleUrl: './devoirs-depots-details.component.css'
})
export class DevoirsDepotsDetailsComponent implements OnInit, OnChanges {
  devoirs!: Devoirs;
  devoirId?: number;
  code!: string;
  secId!: number;

  shouldShowEditModal = false;
  soumissionEnCours! : Soumission ;

  constructor(private route: ActivatedRoute, private router : Router, private ueService : UeService, private filesService : FilesService) {}

  ngOnChanges(changes: SimpleChanges) {
      this.loadSoumission();

  }

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

    this.loadSoumission();

  }

  loadSoumission(){
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


  onModifierSoumission(SoumissionEnCours : Soumission) {
    this.shouldShowEditModal = true;
    this.soumissionEnCours = SoumissionEnCours;
  }

  onFermerModal() {
    this.shouldShowEditModal = false;
  }

  backToProf(){
    this.router.navigate(['/professeur/contenu-ue',this.code]);
  }

  onValiderSoumission() {
    this.loadSoumission();
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
