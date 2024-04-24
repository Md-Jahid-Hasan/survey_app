import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";

const httpOption = {
    headers: new HttpHeaders({
        'Content-Type': 'application/json'
    })
}

@Injectable({
    providedIn: 'root'
})
export class UsersService {
    private user_create_url = "http://127.0.0.1:8000/api/user/create/";
    private user_login_url = "http://127.0.0.1:8000/api/user/login/";

    constructor(private http: HttpClient) {
    }

    createUser(user: object): Observable<object> {
        return this.http.post<object>(this.user_create_url, user, httpOption)
    }

    userLogin(user: object): Observable<object> {
        return this.http.post<object>(this.user_login_url, user, httpOption)
    }


}
