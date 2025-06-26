import {Component, Input, OnInit, SimpleChanges} from '@angular/core';
import {Utilisateur} from '../../../../core/models/user.model';
import {CoursComponent} from '../cours/cours.component';
import {UE} from '../../../../core/models/ue.model';

@Component({
  selector: 'app-liste-cours',
  imports: [
    CoursComponent
  ],
  templateUrl: './liste-cours.component.html',
  styleUrl: './liste-cours.component.css'
})
export class ListeCoursComponent implements OnInit {

  @Input() utilisateur!: Utilisateur;
  @Input() ues!: UE[];

  // Variables pour la pagination
  coursParPage = 6;
  currentPage = 0;
  totalPages = 0;
  paginatedUes: UE[] = [];
  pages: number[] = [];

  ngOnInit() {
    this.initializePagination();
  }

  ngOnChanges(changes: SimpleChanges) {
    // Si les UEs changent (par exemple après un filtrage), on recalcule la pagination
    if (changes['ues']) {
      this.initializePagination();
    }
  }

  // Fonction d'initialisation de la pagination
  initializePagination() {
    if (this.ues && this.ues.length > 0) {
      // Calcul du nombre total de pages
      this.totalPages = Math.ceil(this.ues.length / this.coursParPage);

      // Création du tableau des numéros de pages
      this.createPages();

      // Affichage de la première page
      this.updatePage(0);
    } else {
      this.totalPages = 0;
      this.pages = [];
      this.paginatedUes = [];
    }
  }

  // Création du tableau des numéros de pages
  createPages() {
    this.pages = [];
    for (let i = 0; i < this.totalPages; i++) {
      this.pages.push(i);
    }
  }

  // Mise à jour de la page active et des éléments affichés
  updatePage(page: number) {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page;

      // Calcul de l'intervalle d'éléments à afficher
      const start = page * this.coursParPage;
      const end = start + this.coursParPage;

      // Extraction des UEs pour la page courante
      this.paginatedUes = this.ues.slice(start, end);
    }
  }

  // Fonction appelée lors du clic sur un numéro de page
  onPageClick(page: number) {
    this.updatePage(page);
  }

  // Vérifier si une page est active
  isPageActive(page: number): boolean {
    return page === this.currentPage;
  }

  // Navigation précédente
  previousPage() {
    if (this.currentPage > 0) {
      this.updatePage(this.currentPage - 1);
    }
  }

  // Navigation suivante
  nextPage() {
    if (this.currentPage < this.totalPages - 1) {
      this.updatePage(this.currentPage + 1);
    }
  }

}
