import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { DepartmentsService } from '../../../../services/academics/departments.service';
import { CoursesService } from '../../../../services/academics/courses.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.scss']
})
export class CourseComponent implements OnInit {

  displayedColumns: string[] = ['id', 'name', 'actions'];
  courses;
  departments;
  isCreate: boolean = true;
  selectedCourse;
  form;
  update: boolean = false;

  constructor(
    private builder: FormBuilder,
    private departmentSrv: DepartmentsService,
    private courseSrv: CoursesService
  ) { }

  ngOnInit() {
    this.form = this.builder.group({name: '', dept_id: ''});
    this.getAll();
  }

  getAll() {
    this.departmentSrv.all().subscribe(departments => {
      this.departments = departments
    });
    this.courseSrv.all().subscribe(courses => {
      this.courses = courses
    });
  }

  store(course){
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
        this.courseSrv.store(course).subscribe(data => {
          this.form.reset()
          this.getAll()
          Toast.fire({
            icon: 'success',
            title: 'Course successfully added.'
          })
        });
      } else {
        this.courseSrv.update(course, this.selectedCourse.id).subscribe(data => {
          this.form.reset()
          this.getAll()
          Toast.fire({
            icon: 'success',
            title: 'Course successfully updated.'
          })
        });
      }
    }
  }

  edit(course){
    this.form.patchValue({name: course.name, dept_id: course.dept_id});
    this.selectedCourse = course;
    this.update = true;
  }

  delete(course){
    Swal.fire({
      title: 'Delete ' + course.name,
      text: course.name + ' will be deleted from permanently. Are you sure?',
      icon: 'error',
      showCancelButton: true,
      confirmButtonColor: 'red',
      confirmButtonText: 'Delete'
    }).then((result) => {
      if (result.value) {
        this.courseSrv.destroy(course.id).subscribe(data => {
          this.getAll()
        });
      }
    });

  }

  cancel(){
    this.update = false;
    this.form.reset();
  }

}
