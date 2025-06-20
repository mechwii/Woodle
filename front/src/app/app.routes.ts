import { Routes } from '@angular/router';
import {AdminLayoutComponent} from './admin/layout/admin-layout.component';
import {LoginComponent} from './login/login.component';
import {ProfesseurLayoutComponent} from './professeur/professeur-layout.component';
import {EtudiantLayoutComponent} from './etudiant/layout/etudiant-layout.component';

export const routes: Routes = [
  {path: '', redirectTo: 'login', pathMatch: 'full'},
  {path: 'login', component: LoginComponent},
  {path : 'admin', component: AdminLayoutComponent},
  {path: 'professeur', component: ProfesseurLayoutComponent},
  {path : 'etudiant', component: EtudiantLayoutComponent}
];
