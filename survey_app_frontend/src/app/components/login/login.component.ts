import {Component} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {UsersService} from "../../services/users.service";

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [
        FormsModule,
        ReactiveFormsModule
    ],
    templateUrl: './login.component.html',
    styleUrl: './login.component.css'
})
export class LoginComponent {
    user_details = {
        email: "",
        password: "",
    }

    constructor(private userService: UsersService) {
    }

    onLogin() {
        if (this.user_details.email == "" || this.user_details.password === "")
            alert("Valid Data not provided")
        else{
            this.userService.userLogin(this.user_details).subscribe(user_data => console.log(user_data),
                error => console.log(error.error))
        }
    }
}
