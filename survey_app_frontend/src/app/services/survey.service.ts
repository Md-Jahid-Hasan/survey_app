import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {SurveyList} from "./Survey";

let httpOption = {
    headers: new HttpHeaders({
        'Content-Type': 'application/json',
        // 'Authorization': `Bearer ${localStorage.getItem('rb_token')}`
    })
}

@Injectable({
    providedIn: 'root'
})
export class SurveyService {
    private survey_list_api = "http://127.0.0.1:8000/api/survey/list/"

    constructor(private http:HttpClient) {}

    getSurvey(): Observable<SurveyList[]> {
        httpOption.headers = httpOption.headers.append('Authorization', `Bearer ${localStorage.getItem('token')}`)
        return this.http.get<SurveyList[]>(this.survey_list_api, httpOption)
    }
}
