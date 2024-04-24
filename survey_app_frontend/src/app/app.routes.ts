import { Routes } from '@angular/router';
import {UsersComponent} from "./components/users/users.component";
import {LoginComponent} from "./components/login/login.component";

export const routes: Routes = [
    {path:'create', component: UsersComponent},
    {path:'login', component: LoginComponent}
];
