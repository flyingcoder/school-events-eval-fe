import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { CollegeService } from '../../services/academics/college.service';
import { DepartmentsService } from '../../services/academics/departments.service';
import { CoursesService } from '../../services/academics/courses.service';
import { UsersService } from '../../services/users/users.service';
import Swal from 'sweetalert2';
import { Router } from "@angular/router";
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {

  form;
  colleges;
  departments;
  courses;
  typeSelected: boolean = false;

  constructor(
    private builder: FormBuilder,
    private collegeSrv: CollegeService,
    private departmentSrv: DepartmentsService,
    private courseSrv: CoursesService,
    private userSrv: UsersService,
    private router: Router,
    private authSrv: AuthService
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

  selectType(){
    console.log(this.typeSelected);
    this.typeSelected = true;
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
      this.userSrv.store(user).subscribe(
        data => {
        if(user.type == 2){
          this.login(user)
        } else {
          window.location.reload()
        }
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
  }

  login(user): void {
    this.authSrv.login(user.email, user.password).subscribe( (response: any) => {
      this.authSrv.setToken(response.access_token)
      this.router.navigate(['events'])
    });
  }

}
