import { Routes } from '@angular/router';
import {UsersComponent} from "./components/users/users.component";
import {LoginComponent} from "./components/login/login.component";
import {SurveyListComponent} from "./components/survey-list/survey-list.component";
import {SurveyParticipateComponent} from "./components/survey-participate/survey-participate.component";
import {AuthGuardService} from "./services/auth-guard.service";

export const routes: Routes = [
    {path:'', component: SurveyListComponent, canActivate: [AuthGuardService]},
    {path:'participate/:id', component: SurveyParticipateComponent, canActivate: [AuthGuardService]},
    {path:'create', component: UsersComponent},
    {path:'login', component: LoginComponent},
];
