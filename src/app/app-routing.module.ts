import { NgModule } from '@angular/core';
import { Router, RouterModule, Routes } from '@angular/router';

import { AuthService } from './services/auth.service';
import { LoginComponent } from './login/login.component';
import { isLoggedInGuard } from './services/auth.guard';
import { ReportsComponent } from './reports/reports.component';
import { ClientQuestionnaireComponent } from './client-questionnaire/client-questionnaire.component';


const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'reports',
    component: ReportsComponent,
    canActivate: [isLoggedInGuard]
  },
  {
    path: 'client-questionnaire',
    component: ClientQuestionnaireComponent,
    canActivate: [isLoggedInGuard]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { 
  constructor(private router: Router, private authService: AuthService) {
    this.router.errorHandler = (error: any) => {
      console.log(error);
      this.authService.logout();
    };
  }
}