import {Component, OnInit} from '@angular/core';
import {SurveyService} from "../../services/survey.service";
import {SurveyList} from "../../services/Survey";
import {NgForOf, NgStyle} from "@angular/common";
import {Router, RouterLink} from "@angular/router";

@Component({
    selector: 'app-survey-list',
    standalone: true,
    imports: [
        NgForOf,
        RouterLink,
        NgStyle
    ],
    templateUrl: './survey-list.component.html',
    styleUrl: './survey-list.component.css'
})
export class SurveyListComponent implements OnInit {

    surveys: SurveyList[] = []
    order_by = "started"
    total_pages = 1
    currentPage = 1

    constructor(private surveyService: SurveyService, private router:Router) {
    }

    ngOnInit() {
        // Get all the survey on initialization stage
        this.handleServeyFetch()
    }

    handleServeyFetch(order={}){
        // Call the api for getting survey list
        if (typeof window !== 'undefined' && window.localStorage) {
            this.surveyService.getAllSurvey(order).subscribe(surveys => {
                    this.surveys = surveys.survey
                    this.total_pages = surveys.total_pages
                },
                error => console.log(error))
        }
    }

    surveyOrder(order: string) {
        // Get the survey list on different oder and with pagination
        this.order_by = order
        if (typeof window !== 'undefined' && window.localStorage) {
            this.surveyService.getAllSurvey({order:order}).subscribe(surveys => this.surveys = surveys.survey,
                error => console.log(error))
        }
    }

    previousPage(){
        // In pagination data go to previous page if current page is not less then 1
        if (this.currentPage > 1) {
            this.currentPage--
            let params = {
                start:(this.currentPage*5)-5,
                end:this.currentPage*5
            }
            this.handleServeyFetch(params)
        }
    }
    nextPage(){
        // In pagination data go to next page if current page is not greater then total page
        if (this.currentPage < this.total_pages) {
            this.currentPage++
            let params = {
                start:(this.currentPage*5)-5,
                end:this.currentPage*5
            }
            this.handleServeyFetch(params)
        }
    }

    logout(){
        // This method make user logout by remove token from localstorage
        localStorage.removeItem('token')
        this.router.navigate(['/login'])
    }

    protected readonly parseInt = parseInt;
}
