import {Injectable, OnInit} from '@angular/core';
import {
    ActivatedRouteSnapshot,
    CanActivate,
    GuardResult,
    MaybeAsync,
    Router,
    RouterStateSnapshot
} from "@angular/router";
import {UsersService} from "./users.service";
import {jwtDecode} from "jwt-decode";

@Injectable({
    providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

    /**
     * This guard is responsible for protecting page from unauthorized user. It check if token available and valided
     * token, if valid token found it further proced or return to login
     */
    constructor(private router: Router) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): MaybeAsync<GuardResult> {
        if (typeof window !== 'undefined' && window.localStorage) {
            const token = localStorage.getItem('token')
            if (token) {
                let decodeToken = jwtDecode(token)
                const isExpired = decodeToken && decodeToken.exp ? decodeToken.exp < Date.now() / 1000 : false

                if (isExpired) {
                    localStorage.removeItem('token')
                    this.router.navigate(['/login'])
                    return false
                } else return true
            } else {
                this.router.navigate(['/login'])
                return false
            }
        } else return true
    }

    // canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<boolean> | boolean | MaybeAsync<GuardResult> {

    // return this.userService.loggedInUser().pipe(map(user => {
    //     console.log(user)
    //     if (user.email != null) {
    //         return true
    //     }
    //     else {
    //         this.router.navigate(['/login'])
    //         return false
    //     }
    // }))
    // }
}
