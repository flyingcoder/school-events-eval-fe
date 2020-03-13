import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService as AuthGuard } from './services/auth/auth-guard.service';

import { RegistrationComponent } from './Components/registration/registration.component';
import { LoginComponent } from './Components/login/login.component';
import { LayoutComponent } from './Components/layouts/layout/layout.component';
import { AcademicsComponent } from './Components/panels/academics/academics.component';
import { UsersComponent } from './Components/panels/users/users.component';
import { EvaluationComponent } from './Components/panels/evaluation/evaluation.component';
import { PreviewComponent } from './Components/panels/evaluation/preview/preview.component';
import { EventsComponent } from './Components/panels/events/events.component';
import { ReportsComponent } from './Components/panels/events/reports/reports.component';


const routes: Routes = [
  { path: '', redirectTo: '/events', pathMatch: 'full', canActivate: [AuthGuard]},
  { path: 'register', component: RegistrationComponent},
  { path: 'login', component: LoginComponent},
  { path: 'dashboard', component: LayoutComponent, canActivate: [AuthGuard]},
  { path: 'academics', component: AcademicsComponent, canActivate: [AuthGuard]},
  { path: 'users', component: UsersComponent, canActivate: [AuthGuard]},
  { path: 'user/:id', component: UsersComponent, canActivate: [AuthGuard]},
  { path: 'evaluations', component: EvaluationComponent, canActivate: [AuthGuard]},
  { path: 'evaluation/:id', component: PreviewComponent, canActivate: [AuthGuard]},
  { path: 'events', component: EventsComponent, canActivate: [AuthGuard]},
  { path: 'event/:id', component: EventsComponent, canActivate: [AuthGuard]},
  { path: 'event/:eventId/evaluation/:id', component: PreviewComponent},
  { path: 'event/report/:id', component: ReportsComponent , canActivate: [AuthGuard]}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
