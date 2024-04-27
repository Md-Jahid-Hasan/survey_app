import {Component, OnInit} from '@angular/core';
import {RouterLink, RouterOutlet} from '@angular/router';
import {UsersComponent} from "./components/users/users.component";
import {UsersService} from "./services/users.service";
import {NgIf} from "@angular/common";

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterOutlet, UsersComponent, RouterLink, NgIf],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css'
})

export class AppComponent implements OnInit {
    is_loaded = true
    constructor(private userService: UsersService) {
    }

    ngOnInit() {
        this.userService.getIsLoading().subscribe(value => console.log(value))

    }
}
