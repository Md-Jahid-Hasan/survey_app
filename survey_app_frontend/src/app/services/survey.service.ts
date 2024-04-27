import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {Answer, SurveyDetails, SurveyList} from "./Survey";
import {stringify} from "node:querystring";

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
    private survey_api = 'http://127.0.0.1:8000/api/survey/participate/survey_id/'

    constructor(private http:HttpClient) {}

    getAllSurvey(): Observable<SurveyList[]> {
        if (!httpOption.headers.has('Authorization'))
            httpOption.headers = httpOption.headers.append('Authorization', `Bearer ${localStorage.getItem('token')}`)
        return this.http.get<SurveyList[]>(this.survey_list_api, httpOption)
    }

    getSurvey(id:any): Observable<SurveyDetails>{
        this.survey_api = this.survey_api.replace("survey_id", id.toString())
        if (!httpOption.headers.has('Authorization'))
            httpOption.headers = httpOption.headers.append('Authorization', `Bearer ${localStorage.getItem('token')}`)
        return this.http.get<SurveyDetails>(this.survey_api, httpOption)
    }

    saveAnswer(answer: Answer[], id:any): Observable<any>{
        this.survey_api = this.survey_api.replace("survey_id", id.toString())
        if (!httpOption.headers.has('Authorization'))
            httpOption.headers = httpOption.headers.append('Authorization', `Bearer ${localStorage.getItem('token')}`)
        return this.http.patch<any>(this.survey_api,answer, httpOption)
    }

    submitSurvey(survey: any, id:any): Observable<any>{
        this.survey_api = this.survey_api.replace("survey_id", id.toString())
        if (!httpOption.headers.has('Authorization'))
            httpOption.headers = httpOption.headers.append('Authorization', `Bearer ${localStorage.getItem('token')}`)
        return this.http.put<any>(this.survey_api, survey, httpOption)
    }
}
