import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { DepartmentsService } from '../../../../services/academics/departments.service';
import { CollegeService } from '../../../../services/academics/college.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-department',
  templateUrl: './department.component.html',
  styleUrls: ['./department.component.scss']
})
export class DepartmentComponent implements OnInit {

  displayedColumns: string[] = ['id', 'name', 'actions'];
  departments;
  colleges;
  isCreate: boolean = true;
  selectedDepartment;
  form;
  update: boolean = false;

  constructor(
    private builder: FormBuilder,
    private departmentSrv: DepartmentsService,
    private collegeSrv: CollegeService
  ) { }

  ngOnInit() {
    this.form = this.builder.group({name: '', college_id: ''});
    this.getAll();
  }

  getAll() {
    this.departmentSrv.all().subscribe(departments => {
      this.departments = departments
    });
    this.collegeSrv.all().subscribe(colleges => {
      this.colleges = colleges
    });
  }

  store(department){
    console.log(department);
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
        this.departmentSrv.store(department).subscribe(data => {
          this.form.reset()
          this.getAll()
          Toast.fire({
            icon: 'success',
            title: 'Department successfully added.'
          })
        });
      } else {
        this.departmentSrv.update(department, this.selectedDepartment.id).subscribe(data => {
          this.form.reset()
          this.getAll()
          Toast.fire({
            icon: 'success',
            title: 'Department successfully updated.'
          })
        });
      }
    }
  }

  edit(department){
    this.form.patchValue({name: department.name, college_id: department.college_id});
    this.selectedDepartment = department;
    this.update = true;
  }

  delete(department){
    Swal.fire({
      title: 'Delete ' + department.name,
      text: department.name + ' will be deleted from permanently. Are you sure?',
      icon: 'error',
      showCancelButton: true,
      confirmButtonColor: 'red',
      confirmButtonText: 'Delete'
    }).then((result) => {
      if (result.value) {
        this.departmentSrv.destroy(department.id).subscribe(data => {
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
