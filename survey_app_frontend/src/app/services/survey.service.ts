import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {Answer, SurveyDetails, SurveyList} from "./Survey";

let httpOption = {
    headers: new HttpHeaders({
        'Content-Type': 'application/json',
    })
}

@Injectable({
    providedIn: 'root'
})
export class SurveyService {
    private survey_list_api = "http://127.0.0.1:8000/api/survey/list/"
    private survey_api = 'http://127.0.0.1:8000/api/survey/participate/survey_id/'

    constructor(private http:HttpClient) {}

    getAllSurvey(order:any= {}): Observable<any> {
        // Getting all survey as list
        return this.http.get<any>(this.survey_list_api, {params: order, headers:httpOption.headers})
    }

    getSurvey(id:any): Observable<SurveyDetails>{
        //get specific survey based on id
        const api = this.survey_api.replace("survey_id", id.toString())
        return this.http.get<SurveyDetails>(api, httpOption)
    }

    saveAnswer(answer: Answer[], id:any): Observable<any>{
        //submit answer of specific survey based on id and passed answer of question as body
        const api = this.survey_api.replace("survey_id", id.toString())
        return this.http.patch<any>(api,answer, httpOption)
    }

    submitSurvey(survey: any, id:any): Observable<any>{
        // Finally submit the answer
        const api = this.survey_api.replace("survey_id", id.toString())
        return this.http.put<any>(api, survey, httpOption)
    }
}
