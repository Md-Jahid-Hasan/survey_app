import {Component, OnInit} from '@angular/core';
import {SurveyService} from "../../services/survey.service";
import {SurveyList} from "../../services/Survey";
import {NgForOf} from "@angular/common";

@Component({
    selector: 'app-survey-list',
    standalone: true,
    imports: [
        NgForOf
    ],
    templateUrl: './survey-list.component.html',
    styleUrl: './survey-list.component.css'
})
export class SurveyListComponent implements OnInit {

    surveys:SurveyList[] = []

    constructor(private surveyService: SurveyService) {
    }

    ngOnInit() {
        if (typeof window !== 'undefined' && window.localStorage) {
            this.surveyService.getAllSurvey().subscribe(surveys => this.surveys = surveys,
                error => console.log(error))
        }
    }

    protected readonly parseInt = parseInt;
}
