import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {catchError, Observable, of, Subject, tap} from "rxjs";
import {UserCredentials} from "./User";

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
    private user_url = "http://127.0.0.1:8000/api/user/";

    private authenticateUser: any = {email: null, name: null, is_staff: false}
    private isLoaded = new Subject()

    constructor(private http: HttpClient) {
    }

    createUser(user: object): Observable<object> {
        // user create api
        return this.http.post<object>(this.user_create_url, user, httpOption)
    }

    userLogin(user: { email: string, password: string }): Observable<UserCredentials> {
        // user for user login and return token for authorization
        return this.http.post<UserCredentials>(this.user_login_url, user, httpOption)
    }

    loggedInUser(): Observable<any> {
        this.isLoaded.next(false)
        if (this.authenticateUser.email) {
            return of(this.authenticateUser)
        } else {
            if (typeof window !== 'undefined' && window.localStorage)
                if (!httpOption.headers.has('Authorization'))
                    httpOption.headers = httpOption.headers.append('Authorization', `Bearer ${localStorage.getItem('token')}`)
            return this.http.get(this.user_url, httpOption).pipe(tap(value => {
                this.authenticateUser = value
                this.isLoaded.next(true)
            }), catchError(err => {
                this.isLoaded.next(true)
                return of(this.authenticateUser)
            }))
        }
    }

    getIsLoading(): Observable<any> {
        return this.isLoaded.asObservable()
    }

//{"access":string, "refresh":string, is_staff:boolean, "email": string, "name":string}

}
