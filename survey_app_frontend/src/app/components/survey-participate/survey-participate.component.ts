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
        title: "",
        survey_time: "",
        ended_at: "",
        is_submitted: true,
        is_ended: true,
        questions: [{question: "", question_type: "", options: []}]
    };

    private answerSubject = new Subject()
    answer: Answer[] = []
    currentAnswer: Answer[] = [];

    currentSurvey = 0
    timer_minute = 1
    timer_second = 60

    timer: any;
    survey_id = null;
    is_loaded = false
    is_saved = false

    constructor(private surveyService: SurveyService, private router: Router, private activatedRoute: ActivatedRoute) {
        // This debounce is applied for to restric API call on every change of user input. It only call API after user
        // sit idle for 1.5 seconds
        this.activatedRoute.params.subscribe(value => {
            this.survey_id = value['id']
        })

        this.answerSubject.pipe(
            debounceTime(1500)
        ).subscribe(value => {
            this.surveyService.saveAnswer(this.currentAnswer, this.survey_id).subscribe(value => {
                    this.is_saved = true
                },
                error => console.log(error))
            this.currentAnswer = []
        })
    }

    ngOnInit() {
        // On Initial stage collect the survey id from url and get survey from API call
        this.is_loaded = false
        if (typeof window !== 'undefined' && window.localStorage) {
            this.timer_minute--;
            this.surveyService.getSurvey(this.survey_id).subscribe(value => {
                    this.survey = value
                    if (!value.is_ended)
                        this.timer_minute = Math.floor((new Date(value.ended_at).getTime() - new Date().getTime()) / (1000 * 60))
                    this.is_loaded = true
                    this.startTimer()
                },
                error => {
                    console.log(error)
                    this.router.navigate(['/'])
                })
        }
    }

    ngOnDestroy() {
        clearInterval(this.timer)
    }

    gotToNext() {
        // Slide to the next question
        if (this.currentSurvey < (this.survey.questions.length - 1))
            this.currentSurvey++
    }

    gotToPrevious() {
        // Slide to the previous question
        if (this.currentSurvey > 0) this.currentSurvey--
    }

    startTimer(): void {
        // Start timer started by calling this function only if survey is not ended. This function called from ngOnInit
        if (!this.survey.is_ended || !this.survey.is_submitted) {
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
                    this.router.navigate(['/'])
                }
            }, 1000);
        } else {
            this.timer_minute = 0
            this.timer_second = 0
        }
    }

    onAddOption(event: any, question: any) {
        // This method is save checkbox input change of user. When user idle for 1.5 sec the last changes of user will
        // submitted and save by api call
        if (!this.survey.is_ended || !this.survey.is_submitted) {
            this.is_saved = false
            if (!event.currentTarget.checked) {
                this.answer = this.answer.filter(ans => ans.option != event.target.value)
            } else {
                this.answer.push({question: question, option: event.target.value})
            }
            this.survey.questions[this.currentSurvey].options.map(op => op.id == event.target.value ? op.answer = event.currentTarget.checked : null)
            this.currentAnswer.push({question: question, option: event.target.value})
            this.answerSubject.next(this.answer)
        }
    }

    onChangeAnswer(event: any, question: any, text_answer: boolean = false) {
        //This method is responsible for save new input of text field and radio buttons.
        if (!this.survey.is_ended || !this.survey.is_submitted) {
            this.is_saved = false
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
    }

    updateAnswer(newAnswer: any) {
        const index = this.answer.findIndex(ans => ans.question === newAnswer.question)
        if (index !== -1) {
            this.answer[index] = newAnswer
        } else this.answer.push(newAnswer)
        this.answerSubject.next(this.answer)
    }

    onSubmit() {
        //once user press submit button this function is activated and submit the final answer.
        if (!this.survey.is_ended || !this.survey.is_submitted) {
            this.surveyService.submitSurvey({submit: true}, this.survey_id).subscribe(value => {
                    this.router.navigate(['/'])
                },
                error => {
                    console.log(error)
                })
        }
    }

    logout() {
        // This method make user logout by remove token from localstorage
        localStorage.removeItem('token')
        this.router.navigate(['/login'])
    }

    protected readonly parseInt = parseInt;
}
