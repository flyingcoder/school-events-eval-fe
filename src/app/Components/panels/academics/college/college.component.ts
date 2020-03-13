import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { CollegeService } from '../../../../services/academics/college.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-college',
  templateUrl: './college.component.html',
  styleUrls: ['./college.component.scss']
})
export class CollegeComponent implements OnInit {

  displayedColumns: string[] = ['id', 'name', 'actions'];
  colleges;
  isCreate: boolean = true;
  selectedCollege;
  form;
  update: boolean = false;

  constructor(
    private builder: FormBuilder,
    private collegeSrv: CollegeService
  ) { }

  ngOnInit() {
    this.form = this.builder.group({name: ''});
    this.getColleges();
  }

  getColleges() {
    this.collegeSrv.all().subscribe(colleges => {
      this.colleges = colleges
    });
  }

  store(college){

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
        this.collegeSrv.store(college).subscribe(data => {
          this.form.reset()
          this.getColleges()
          Toast.fire({
            icon: 'success',
            title: 'College successfully added.'
          })
        });
      } else {
        this.collegeSrv.update(college, this.selectedCollege.id).subscribe(data => {
          this.form.reset()
          this.getColleges()
          Toast.fire({
            icon: 'success',
            title: 'College successfully updated.'
          })
        });
      }
    }
  }

  edit(college){
    this.form.patchValue({name: college.name});
    this.selectedCollege = college;
    this.update = true;
  }

  delete(college){
    Swal.fire({
      title: 'Delete ' + college.name,
      text: college.name + ' will be deleted from permanently. Are you sure?',
      icon: 'error',
      showCancelButton: true,
      confirmButtonColor: 'red',
      confirmButtonText: 'Delete'
    }).then((result) => {
      if (result.value) {
        this.collegeSrv.destroy(college.id).subscribe(data => {
          this.getColleges()
        });
      }
    });

  }

  cancel(){
    this.update = false;
    this.form.reset();
  }

}
