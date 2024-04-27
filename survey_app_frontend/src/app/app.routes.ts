import { Routes } from '@angular/router';
import {UsersComponent} from "./components/users/users.component";
import {LoginComponent} from "./components/login/login.component";
import {SurveyListComponent} from "./components/survey-list/survey-list.component";
import {SurveyParticipateComponent} from "./components/survey-participate/survey-participate.component";

export const routes: Routes = [
    {path:'create', component: UsersComponent},
    {path:'login', component: LoginComponent},
    {path:'survey', component: SurveyListComponent},
    {path:'participate/:id', component: SurveyParticipateComponent},
];
