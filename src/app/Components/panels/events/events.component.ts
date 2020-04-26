import { Component, OnInit } from '@angular/core';
import { EventsService } from '../../../services/events/events.service';
import { EvaluationsService } from '../../../services/evaluations/evaluations.service';
import { CollegeService } from '../../../services/academics/college.service';
import { DepartmentsService } from '../../../services/academics/departments.service';
import { CoursesService } from '../../../services/academics/courses.service';
import { FormBuilder, Validators } from '@angular/forms';
import { AnswersService } from '../../../services/answers/answers.service';
import { AuthService } from '../../../services/auth/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ExportToCsv } from 'export-to-csv';
import { MatTableDataSource } from '@angular/material/table';

import Swal from 'sweetalert2';
import * as moment from 'moment';

export interface User {
  id: string;
  type: string;
}


@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss']
})

export class EventsComponent implements OnInit {

  enableForm: boolean = false;
  events;
  evaluations;
  user;
  courses;
  colleges;
  id;
  departments;
  ready: boolean = false;
  form;
  update: boolean = false;
  displayedColumns: string[] = ['id', 'name', 'venue', 'semester', 'year',  'date', 'actions'];

  constructor(
    private builder: FormBuilder,
    private eventSrv: EventsService,
    private evalSrv: EvaluationsService,
    private collegeSrv: CollegeService,
    private courseSrv: CoursesService,
    private departmentSrv: DepartmentsService,
    private answerSrv: AnswersService,
    private authSrv: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.form = this.builder.group(
      {
        name: ['', Validators.required],
        venue: '',
        event_date: '',
        school_year: '',
        semester: '',
        evaluation: ['', Validators.required],
        college: '',
        department: '',
        course: '',
        status: '1'
      }
    );
    this.getAll();
    this.id = this.route.snapshot.paramMap.get('id');
    if(this.id != null){
      this.update = true;
      this.enableForm = true;
      this.getEvent();
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.events.filter = filterValue.trim().toLowerCase();
  }

  getAll(){
    this.authSrv.me().subscribe((user: User) => {
      this.user = user.id
      if(user.type == '1'){
        this.eventSrv.all().subscribe(events => {
          this.events = new MatTableDataSource(events)
          this.ready = true
          console.log(this.events)
        })
        this.evalSrv.all().subscribe(evaluations => {
          this.evaluations = evaluations
        });
      } else if(user.type == '2'){
        this.eventSrv.allPerUser(this.user).subscribe(events => {
          this.events = new MatTableDataSource(events)
          this.ready = true
        })
        this.evalSrv.allPerUser(this.user).subscribe(evaluations => {
          this.evaluations = evaluations
        });
      }

    });


    this.collegeSrv.all().subscribe(colleges => {
      this.colleges = colleges
    });

  }

  getEvent(){
    this.eventSrv.show(this.id).subscribe(event => {
      console.log(event)
      this.getDepartments({value: event.college})
      this.getCourses({value: event.department})
      console.log(event);
      this.form.patchValue(
        {
          name: event.name,
          venue: event.venue,
          school_year: event.school_year,
          semester: event.semester,
          event_date: this.reformatDate(new Date(event.date)),
          evaluation: event.evaluation,
          college: event.college_id,
          department: event.department_id,
          course: event.course_id
        });
    });
  }

  getDepartments(data){
    this.departmentSrv.getDepartmentsPerCollege(data.value).subscribe(departments => {
      this.departments = departments
    });
  }

  getCourses(data){
    this.courseSrv.getCourses(data.value).subscribe(courses => {
      this.courses = courses
      console.log(courses)
    });
  }

  store(event){
    event.user_id = this.user;
    event.event_date = this.formatDate(event.event_date);
    console.log(event);

    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      onOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
      }
    });

    if(this.form.valid){
      if(!this.update){
        this.eventSrv.store(event).subscribe(
          data => {
          window.location.reload()
          //this.getAll()
          Toast.fire({
            icon: 'success',
            title: 'User successfully added.'
          })
        },
        errors => {
          var html = '<ul>';
          errors.error.forEach(error => {
            html += '<li>' + error + '</li>'
          });
          html += '</ul>';

          Swal.fire({
            title: 'Event ' + event.name + ' was not added.',
            html: html,
            icon: 'error',
            showCancelButton: true,
            confirmButtonColor: 'red',
            confirmButtonText: 'Delete'
          });
        });
      } else {
        this.eventSrv.update(event, this.id).subscribe(data => {
          this.enableForm = false
          this.router.navigate(['/events'])
          this.getAll()
          Toast.fire({
            icon: 'success',
            title: 'User successfully updated.'
          })
        });
      }
    }
  }

  formatDate(date){
    return moment(new Date(date)).format("YYYY-MM-DD HH:mm:ss")
  }

  dateFormat(date){
    return moment(new Date(date)).format("MMMM DD, YYYY")
  }

  reformatDate(date) {
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();
    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    return [year, month, day].join('-');
  }

  send(event){
    this.eventSrv.send(event.id).subscribe(data => {
      Swal.fire({
        title: 'Evaluation successfully sent to students. ',
        html: '<p>Evaluation for event ' + event.name + ' has been sent to  <b>'+ data.students.length+'</b> students.</p>',
        icon: 'success',
        showCancelButton: false,
        confirmButtonColor: '##2c39bf'
      });
    });
  }

  report(event){
    this.answerSrv.getAnswers(event.id).subscribe(answers => {
      console.log(answers)
      this.calculateReport(answers)
    });
  }

  calculateReport(answers){
    var evaluation = JSON.parse(answers[0].answers);
    var totalAnswers = answers.length;

    answers.forEach(answer => {
      var sanitizedAnswers = JSON.parse(answer.answers);
      var i;
      var average = 0;
      for(i = 0; i < sanitizedAnswers.length; i++){
        console.log(sanitizedAnswers[i]);
      }
    });
    console.log(evaluation);
  }

  delete(event){
    Swal.fire({
      title: 'Delete ' + event.name,
      text: event.name + ' will be deleted from permanently. Are you sure?',
      icon: 'error',
      showCancelButton: true,
      confirmButtonColor: 'red',
      confirmButtonText: 'Delete'
    }).then((result) => {
      if (result.value) {
        this.eventSrv.destroy(event.id).subscribe(data => {
          this.getAll()
        });
      }
    });
  }

  back(){
    this.enableForm = false;
    this.getAll();
    this.router.navigate(['/events']);
  }

  updateStatus(event){
    if(event.status == 1){
      event.status = 0;
    } else {
      event.status = 1;
    }

    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      onOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
      }
    });


    this.eventSrv.updateStatus(event, event.id).subscribe(data => {
      this.getAll()
      Toast.fire({
        icon: 'success',
        title: 'Event successfully updated.'
      })
    });
  }



}
