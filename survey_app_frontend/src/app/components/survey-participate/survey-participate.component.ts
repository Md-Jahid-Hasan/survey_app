import {Component, OnDestroy, OnInit} from '@angular/core';
import {SurveyService} from "../../services/survey.service";
import {Answer, SurveyDetails} from "../../services/Survey";
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {debounceTime, Subject} from "rxjs";
import {Router, ActivatedRoute} from "@angular/router";

@Component({
    selector: 'app-survey-participate',
    standalone: true,
    imports: [
        NgForOf,
        NgIf,
        NgClass,
        FormsModule
    ],
    templateUrl: './survey-participate.component.html',
    styleUrl: './survey-participate.component.css'
})
export class SurveyParticipateComponent implements OnInit, OnDestroy {
    survey: SurveyDetails = {
        title: "", survey_time: "", ended_at:"", questions: [{question: "", question_type: "", options: []}]
    };

    private answerSubject = new Subject()
    answer: Answer[] = []
    currentAnswer: Answer[] = [];

    currentSurvey = 0
    timer: any;
    timer_minute = 1
    timer_second = 60

    survey_id = null;

    constructor(private surveyService: SurveyService, private router:Router, private activatedRoute: ActivatedRoute) {
        this.answerSubject.pipe(
            debounceTime(1500)
        ).subscribe(value => {
            this.surveyService.saveAnswer(this.currentAnswer, this.survey_id).subscribe(value => console.log(this.currentSurvey),
                    error => console.log(error))
            console.log(this.currentAnswer, this.survey)
            this.currentAnswer = []
        })
    }

    ngOnInit() {
        this.activatedRoute.params.subscribe(value => this.survey_id=value['id'])
        if (typeof window !== 'undefined' && window.localStorage) {
            this.timer_minute--;
            this.surveyService.getSurvey(this.survey_id).subscribe(value => {
                    this.survey = value
                    this.timer_minute = Math.floor((new Date(value.ended_at).getTime() - new Date().getTime())/ (1000*60))
                },
                error => {
                    console.log(error)
                    this.router.navigate(['/survey'])
                })
            this.startTimer()
        }
    }

    ngOnDestroy() {
        clearInterval(this.timer)
    }

    gotToNext() {
        if (this.currentSurvey < (this.survey.questions.length - 1))
            this.currentSurvey++
    }

    gotToPrevious() {
        if (this.currentSurvey > 0) this.currentSurvey--
    }

    startTimer(): void {
        this.timer = setInterval(() => {
            this.timer_second--;

            if (this.timer_second == 0) {
                // Time's up, go to the next question
                this.timer_second = 60;
                this.timer_minute--;
            }
            if (this.timer_minute < 0) {
                clearInterval(this.timer)
                this.timer_second = 0
                this.timer_minute = 0
            }
        }, 1000);
    }

    onAddOption(event: any, question: any) {
        if (!event.currentTarget.checked) {
            this.answer = this.answer.filter(ans => ans.option != event.target.value)
        } else {
            this.answer.push({question: question, option: event.target.value})
        }
        this.survey.questions[this.currentSurvey].options.map(op => op.id == event.target.value ? op.answer = event.currentTarget.checked: null)
        this.currentAnswer.push({question: question, option: event.target.value})
        this.answerSubject.next(this.answer)
    }

    onChangeAnswer(event: any, question: any, text_answer: boolean = false) {
        let newAnswer: Answer;
        if (text_answer) {
            newAnswer = {question: question, text_answer: event.target.value}
            this.survey.questions[this.currentSurvey].text_answer = event.target.value
        } else {
            newAnswer = {question: question, option: event.target.value}
            this.survey.questions[this.currentSurvey].options.map(op => op.id == event.target.value ? op.answer = true : op.answer = false)
        }
        this.updateAnswer(newAnswer)
        this.currentAnswer = [newAnswer]
    }

    updateAnswer(newAnswer: any) {
        const index = this.answer.findIndex(ans => ans.question === newAnswer.question)
        if (index !== -1) {
            this.answer[index] = newAnswer
        } else this.answer.push(newAnswer)
        this.answerSubject.next(this.answer)
    }

    onSubmit(){
        this.surveyService.submitSurvey({submit:true}, this.survey_id).subscribe(value => {this.router.navigate(['/survey'])},
                error => {console.log(error)})
    }

    protected readonly parseInt = parseInt;
}
