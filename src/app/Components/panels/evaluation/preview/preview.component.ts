import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { EvaluationsService } from '../../../../services/evaluations/evaluations.service';
import { EventsService } from '../../../../services/events/events.service';
import { AnswersService } from '../../../../services/answers/answers.service';
import { AuthService } from '../../../../services/auth/auth.service';

import * as moment from 'moment';
import Swal from 'sweetalert2';
/*
interface User {
    type: any
}*/

@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.scss']
})
export class PreviewComponent implements OnInit {

  id;
  event;
  form;
  evaluation;
  eventId;
  user: any;
  ready: boolean = false;
  validity: boolean = false;
  loggedIn: boolean = false;
  enabled: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private builder: FormBuilder,
    private router: Router,
    private evalSrv: EvaluationsService,
    private eventSrv: EventsService,
    private answerSrv: AnswersService,
    private authSrv: AuthService
  ) { }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    this.form = this.builder.group({email: ['', Validators.required], password: ['', Validators.required]});
    this.eventId = this.route.snapshot.paramMap.get('eventId');
    this.evalSrv.show(this.id).subscribe(evaluation => {
      this.evaluation = evaluation
      console.log(this.evaluation)
      if(this.eventId != null){
        this.eventSrv.show(this.eventId).subscribe(event => {
          this.event = event
          console.log(this.event)
          this.checkIfLoggedIn();
        });
      } else {
        this.ready = true;
      }
    });
    console.log("this")

  }

  submit(){
    if(!this.checkValidForm()){
      Swal.fire({
        title: 'All fields are required',
        html: '<p>You must answer all criterias and subcriterias before submitting.</p>',
        icon: 'error',
        showCancelButton: false,
        confirmButtonText: 'Okay'
      });
      return;
    }

    var answer = {
      event_id: this.event.id,
      user_id: this.user.id,
      answers: JSON.stringify(this.evaluation.criterias)
    };
    this.answerSrv.store(answer).subscribe(data => {
      Swal.fire({
        title: 'Evaluation successfully submitted. ',
        html: '<p>Thank you! Your evaluation was submitted successfully, this will help us improve future events.</p>',
        icon: 'success',
        showCancelButton: false,
        confirmButtonColor: '##2c39bf'
      }).then((result) => {
        if (result.value) {
          window.location.reload()
        }
      });
    }, error => {
      console.log(error)
    })
  }

  checkValidForm(){
    var valid = true;
    this.evaluation.criterias.forEach(criteria => {
      if(criteria.subcriterias.length > 0){
        criteria.subcriterias.forEach(subcriteria => {
          if(subcriteria.answer == null){
            valid = false;
          }
        });
      } else {
        if(criteria.answer == null){
          valid = false;
        }
      }
    });
    return valid;
  }

  dateFormat(date){
    return moment(new Date(date)).format("MMMM DD, YYYY")
  }

  checkIfLoggedIn(){
    this.loggedIn = false;
    if(!this.authSrv.isTokenExpired()){
      this.loggedIn = true;
      this.authSrv.me().subscribe((user:any) => {
        this.user = user
        if(user.type == 3){
          if(this.event.status == 0){
            this.enabled = false;
          }
        }
        this.checkAnswers()
      });
    }
  }

  login(user): void {
    this.authSrv.login(user.email, user.password).subscribe( (response: any) => {
      this.authSrv.setToken(response.access_token)
      this.loggedIn = true
      window.location.reload()
    }, error => {
      Swal.fire({
        title: 'Incorrect login credentials.',
        html: '<p>Please make sure the login credentials are correct.</p>',
        icon: 'error',
        showCancelButton: false,
        confirmButtonText: 'Okay'
      });
    });
  }

  checkAnswers(){
    this.validity = true;
    this.answerSrv.checkAnswers(this.user.id, this.eventId).subscribe(data => {
      console.log(data)
      this.ready = true
      if(data.length > 0){
        this.validity = false
      }
    });
  }

}
