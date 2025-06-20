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

export const routes: Routes = [
  {path: '', redirectTo: 'login', pathMatch: 'full'},
  {path: 'login', canActivate : [guestOnlyGuard] ,component: LoginComponent},
  {path : 'admin', canActivate : [authGuard, adminGuard] ,component: AdminLayoutComponent},
  {path: 'professeur', canActivate : [authGuard, professeurGuard], component: ProfesseurLayoutComponent},
  {path : 'etudiant', canActivate : [authGuard, etudiantGuard], component: EtudiantLayoutComponent}
];
