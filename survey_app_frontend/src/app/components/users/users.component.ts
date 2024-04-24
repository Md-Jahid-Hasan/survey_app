import {Component} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {UsersService} from "../../services/users.service";
import {Router} from "@angular/router";

@Component({
    selector: 'app-users',
    standalone: true,
    imports: [
        FormsModule
    ],
    templateUrl: './users.component.html',
    styleUrl: './users.component.css'
})
export class UsersComponent {
    user_details = {
        name: "",
        email: "",
        password: "",
        confirm_password: ""
    }

    constructor(private userService:UsersService, private router: Router) {}

    onSubmit() {
        if (this.user_details.password !== this.user_details.confirm_password)
            alert("password dont match")
        else if (this.user_details.name === "" || this.user_details.email == "" || this.user_details.password === "" ||
                this.user_details.confirm_password === "")
                alert("Valid Data not provided")
        else {
            this.userService.createUser(this.user_details).subscribe(new_user =>{
                this.router.navigate(['/login'])
                },
                error => {console.log(error.error)})
        }
    }
}
