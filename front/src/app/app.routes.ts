import { Routes } from '@angular/router';
import {AdminLayoutComponent} from './admin/layout/admin-layout.component';
import {LoginComponent} from './login/login.component';
import {ProfesseurLayoutComponent} from './professeur/professeur-layout.component';
import {EtudiantLayoutComponent} from './etudiant/layout/etudiant-layout.component';
import {authGuard} from './core/guards/auth.guard';
import {guestOnlyGuard} from './core/guards/guest-only.guard';
import {adminGuard} from './core/guards/admin.guard';
import {etudiantGuard} from './core/guards/etudiant.guard';
import {professeurGuard} from './core/guards/professeur.guard';
import {AdminDashboardComponent} from './admin/dashboard/admin-dashboard/admin-dashboard.component';
import {
  ProfesseurContenuUeComponent
} from './professeur/contenu-ue/professeur-contenu-ue/professeur-contenu-ue.component';
import {ProfesseurChoixUeComponent} from './professeur/choix-ue/professeur-choix-ue/professeur-choix-ue.component';
import {PageDevoirsComponent} from './professeur/route-temporaire-devoirs/page-devoirs/page-devoirs.component';
import {
  DevoirsDepotsDetailsComponent
} from './professeur/route-temporaire-devoirs/devoirs-depots-details/devoirs-depots-details.component';
import {
  DevoirsEleveDetailsComponent
} from './professeur/route-temporaire-devoirs/devoirs-eleve-details/devoirs-eleve-details.component';

export const routes: Routes = [
  {path: '', redirectTo: 'login', pathMatch: 'full'},
  {path: 'login', canActivate : [guestOnlyGuard] ,component: LoginComponent},
  {path : 'admin', canActivate : [authGuard, adminGuard] ,component: AdminLayoutComponent, children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {path : 'dashboard', component: AdminDashboardComponent}
    ]},
  {path: 'professeur', canActivate : [authGuard, professeurGuard], component: ProfesseurLayoutComponent, children: [
      { path: '', redirectTo: 'choix-ue', pathMatch: 'full' },
      {path : 'choix-ue', component: ProfesseurChoixUeComponent},
      {path : 'contenu-ue/:code', component: ProfesseurContenuUeComponent},
      {path : 'devoirs', component: PageDevoirsComponent},
      { path: 'devoirs/:id', component: DevoirsDepotsDetailsComponent }
    ]},
  {path : 'etudiant', canActivate : [authGuard, etudiantGuard], component: EtudiantLayoutComponent, children: [
      {path : 'devoirs/:id', component: DevoirsEleveDetailsComponent},
    ]}
];
