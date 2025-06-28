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
import {ProfileComponent} from './shared/profile/profile.component';
import {ueGuard} from './core/guards/ue-guard';

export const routes: Routes = [
  {path: '', redirectTo: 'login', pathMatch: 'full'},
  {path: 'login', canActivate : [guestOnlyGuard] ,component: LoginComponent},
  {path : 'admin', canActivate : [authGuard, adminGuard] ,component: AdminLayoutComponent, children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {path : 'dashboard', component: AdminDashboardComponent},
      {path: 'profil', component: ProfileComponent}
    ]},
  {path: 'professeur', canActivate : [authGuard, professeurGuard], component: ProfesseurLayoutComponent, children: [
      { path: '', redirectTo: 'choix-ue', pathMatch: 'full' },
      {path : 'choix-ue', component: ChoixUeComponent},
      {path : 'contenu-ue/:code', canActivate :[ueGuard], component: ContenuUeComponent},
      { path: 'devoirs/:code/:secId/:id',canActivate :[ueGuard], component: DevoirsDepotsDetailsComponent },
      { path: 'forums/:code/:secId/:id',canActivate :[ueGuard], component: ForumPageComponent },
      { path: 'forums/:code/:secId/:forumId/:id',canActivate :[ueGuard], component: SujetPageComponent },
      { path: 'devoirs/:code/:secId/:id',canActivate :[ueGuard], component: DevoirsDepotsDetailsComponent },
      {path: 'profil', component: ProfileComponent}

    ]},
  {path : 'etudiant', canActivate : [authGuard, etudiantGuard], component: EtudiantLayoutComponent, children: [
      { path: '', redirectTo: 'choix-ue', pathMatch: 'full' },
      {path : 'choix-ue', component: ChoixUeComponent},
      {path : 'contenu-ue/:code',canActivate :[ueGuard], component: ContenuUeComponent},
      {path : 'devoirs/:code/:secId/:id',canActivate :[ueGuard], component: DevoirsEleveDetailsComponent},
      { path: 'forums/:code/:secId/:id',canActivate :[ueGuard], component: ForumPageComponent },
      { path: 'forums/:code/:secId/:forumId/:id',canActivate :[ueGuard], component: SujetPageComponent },
      {path: 'profil', component: ProfileComponent}


    ]}
];
