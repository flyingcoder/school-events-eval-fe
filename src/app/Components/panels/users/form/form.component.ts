import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { FormBuilder, Validators } from '@angular/forms';
import { CollegeService } from '../../../../services/academics/college.service';
import { DepartmentsService } from '../../../../services/academics/departments.service';
import { CoursesService } from '../../../../services/academics/courses.service';
import { UsersService } from '../../../../services/users/users.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit {

  @Input() id;
  form;
  colleges;
  departments;
  courses;
  password = '';
  update: boolean = false;
  types = [
    {id: 1, name: 'Administrator'},
    {id: 2, name: 'Staff / Faculty'},
    {id: 3, name: 'Student'}
  ];
  errors = [];

  constructor(
    private builder: FormBuilder,
    private collegeSrv: CollegeService,
    private departmentSrv: DepartmentsService,
    private courseSrv: CoursesService,
    private userSrv: UsersService,
    private router: Router
  ) { }

  ngOnInit() {
    this.form = this.builder.group(
                {
                  name: ['', Validators.required],
                  email: ['', [Validators.required, Validators.pattern("[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$")]],
                  phone: ['', [Validators.required, Validators.minLength(11)]],
                  type: ['', Validators.required],
                  password: ['', Validators.required],
                  school_id: ['', Validators.required],
                  college: ['', Validators.required],
                  department: ['', Validators.required],
                  course: ['', Validators.required]
                }
              );
      if(this.id != null){
        this.update = true;
        this.getUser();
      }
      this.getAll();
  }

  getAll(){
    this.collegeSrv.all().subscribe(colleges => {
      this.colleges = colleges
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
    });
  }

  getUser(){
    this.userSrv.show(this.id).subscribe(user => {
      console.log(user)
      this.getDepartments({value: user.college})
      this.getCourses({value: user.department})
      this.password = user.password
      this.form.controls.password.setValidators('')
      this.form.controls.password.updateValueAndValidity()
      this.form.patchValue(
        {
          name: user.name,
          email: user.email,
          phone: user.phone,
          type: user.type,
          school_id: user.school_id,
          college: user.college,
          department: user.department,
          course: parseInt(user.course)
        });

    })
  }

  store(user){
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
        this.userSrv.store(user).subscribe(
          data => {
          window.location.reload()
          this.getAll()
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
            title: 'User ' + user.name + ' was not added.',
            html: html,
            icon: 'error',
            showCancelButton: true,
            confirmButtonColor: 'red',
            confirmButtonText: 'Delete'
          });
        });
      }
      else {
        if(user.password == ''){
          user.password = this.password
        }
        this.userSrv.update(user, this.id).subscribe(data => {
          this.router.navigate(['/users'])
          Toast.fire({
            icon: 'success',
            title: 'User successfully updated.'
          })
        });
      }
    }
  }

  cancel(){
    this.router.navigate(['/users']);
  }

}
