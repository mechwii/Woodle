import {Component, Input, OnInit} from '@angular/core';
import {Devoirs, Soumission} from '../../../core/models/temp-publication.model';
import {DatePipe} from '@angular/common';
import {ActivatedRoute} from '@angular/router';
import {EditSoumissionEleveComponent} from '../modal/edit-soumission-eleve/edit-soumission-eleve.component';

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
  @Input() utilisateurId!: number; // a mettre le bon id du mec connecte

  listeDevoirs: Devoirs[] =[
    {
      _id: 1,
      titre: 'Devoir de Mathématiques',
      description: 'Résoudre les équations du chapitre 2.',
      publicateur_id: 101,
      date_creation: '2025-06-01T10:00:00Z',
      date_limite: '2025-06-30T23:59:59Z',
      visible: true,
      instructions: {
        taille_fichier: 5, // en Mo
        type_fichier: 1     // par exemple 1 = PDF
      },
      soumissions: [
        {
          _id: 1001,
          etudiant_id: 201,
          date_soumission: '2025-06-20T15:30:00Z',
          statut: 'Soumis',
          fichiers: {
            extension : "pdf",
            nom_original : "pipi.jpg",
            nom_stockage : "popo.jpg"
          },
          note: 16,
          commentaire_prof: 'Bon travail, quelques erreurs de calcul.',
          correcteur_id: 301,
          date_correction: '2025-06-22T18:00:00Z'
        },
        {
          _id: 1001,
          etudiant_id: 204,
          date_soumission: '2025-06-20T15:30:00Z',
          statut: 'Soumis',
          fichiers: {
            extension : "pdf",
            nom_original : "prout.jpg",
            nom_stockage : "pips.jpg"
          },
          note: 13,
          commentaire_prof: 'Bon travail, quelques erreurs de calcul.',
          correcteur_id: 303,
          date_correction: '2025-06-22T18:00:00Z'
        }
      ]
    },
    {
      _id: 2,
      titre: 'Devoir d’Histoire',
      description: 'Rédiger une dissertation sur la Révolution française.',
      publicateur_id: 102,
      date_creation: '2025-06-10T12:00:00Z',
      date_limite: '2025-07-01T23:59:59Z',
      visible: true,
      instructions: {
        taille_fichier: 10, // 10 Mo max
        type_fichier: 1     // PDF
      },
      soumissions: [
        {
          _id: 1002,
          etudiant_id: 202,
          date_soumission: '2025-06-29T11:00:00Z',
          statut: 'Soumis',
          fichiers: {
            extension : "pdf",
            nom_original : "pipi.jpg",
            nom_stockage : "popo.jpg"
          },
          note: 18,
          commentaire_prof: 'Très bien rédigé, argumentation solide.',
          correcteur_id: 302,
          date_correction: '2025-06-30T10:00:00Z'
        },
        {
          _id: 1003,
          etudiant_id: 203,
          date_soumission: '2025-06-30T22:45:00Z',
          statut: 'Soumis',
          fichiers: {
            extension : "pdf",
            nom_original : "pipi.jpg",
            nom_stockage : "popo.jpg"
          },
          note: 14,
          commentaire_prof: 'Des idées intéressantes mais manque de structure.',
          correcteur_id: 302,
          date_correction: '2025-07-01T09:00:00Z'
        }
      ]
    }
  ];

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.devoir = this.listeDevoirs.find((d) => d._id === id)!;
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

}
