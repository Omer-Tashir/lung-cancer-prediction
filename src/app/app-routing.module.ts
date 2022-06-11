import { NgModule } from '@angular/core';
import { Router, RouterModule, Routes } from '@angular/router';

import { AuthService } from './services/auth.service';
import { LoginComponent } from './login/login.component';
import { DoctorLoginComponent } from './login/doctor-login/doctor-login.component';


const routes: Routes = [
  {
    path: '',
    redirectTo: '/login/doctor-login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: LoginComponent,
    children: [
      {
        path: 'doctor-login',
        component: DoctorLoginComponent
      },
    ]
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
      alert(error);
      this.authService.logout();
    };
  }
}