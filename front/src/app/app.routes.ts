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

import {ChoixUeComponent} from './shared/choix-ue/choix-ue.component';
import {
  DevoirsDepotsDetailsComponent
} from './professeur/devoirs-depots-details/devoirs-depots-details.component';
import {
  DevoirsEleveDetailsComponent
} from './etudiant/devoirs-eleve-details/devoirs-eleve-details.component';
import {ContenuUeComponent} from './shared/contenu-ue/contenu-ue.component';
import {ForumPageComponent} from './shared/forum-page/forum-page.component';
import {SujetPageComponent} from './shared/sujet-page/sujet-page.component';

export const routes: Routes = [
  {path: '', redirectTo: 'login', pathMatch: 'full'},
  {path: 'login', canActivate : [guestOnlyGuard] ,component: LoginComponent},
  {path : 'admin', canActivate : [authGuard, adminGuard] ,component: AdminLayoutComponent, children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {path : 'dashboard', component: AdminDashboardComponent}
    ]},
  {path: 'professeur', canActivate : [authGuard, professeurGuard], component: ProfesseurLayoutComponent, children: [
      { path: '', redirectTo: 'choix-ue', pathMatch: 'full' },
      {path : 'choix-ue', component: ChoixUeComponent},
      {path : 'contenu-ue/:code', component: ContenuUeComponent},
      { path: 'devoirs/:code/:secId/:id', component: DevoirsDepotsDetailsComponent },
      { path: 'forums/:code/:secId/:id', component: ForumPageComponent },
      { path: 'forums/:code/:secId/:forumId/:id', component: SujetPageComponent }
    ]},
  {path : 'etudiant', canActivate : [authGuard, etudiantGuard], component: EtudiantLayoutComponent, children: [
      { path: '', redirectTo: 'choix-ue', pathMatch: 'full' },
      {path : 'choix-ue', component: ChoixUeComponent},
      {path : 'contenu-ue/:code', component: ContenuUeComponent},
      {path : 'devoirs/:code/:secId/:id', component: DevoirsEleveDetailsComponent},
      { path: 'forums/:code/:secId/:id', component: ForumPageComponent },
      { path: 'forums/:code/:secId/:forumId/:id', component: SujetPageComponent }
    ]}
];
