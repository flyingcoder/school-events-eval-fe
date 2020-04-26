import { Component, OnInit } from '@angular/core';
import { UsersService } from '../../../../services/users/users.service';
import Swal from 'sweetalert2';
import { MatTableDataSource } from '@angular/material/table';

export interface users {
  id: number;
  name: string;
  contacts: string;
}

@Component({
  selector: 'app-faculty',
  templateUrl: './faculty.component.html',
  styleUrls: ['./faculty.component.scss']
})

export class FacultyComponent implements OnInit {

  users;
  displayedColumns: string[] = ['id', 'name', 'contacts', 'actions'];

  constructor(
    private userSrv: UsersService
  ) { }

  ngOnInit() {
    this.getAll();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.users.filter = filterValue.trim().toLowerCase();
  }

  getAll() {
    this.userSrv.getByType(2).subscribe(users => {
      this.users = new MatTableDataSource(users)
    });
  }

  delete(user){
    Swal.fire({
      title: 'Delete ' + user.name,
      text: user.name + ' will be deleted from permanently. Are you sure?',
      icon: 'error',
      showCancelButton: true,
      confirmButtonColor: 'red',
      confirmButtonText: 'Delete'
    }).then((result) => {
      if (result.value) {
        this.userSrv.destroy(user.id).subscribe(data => {
          this.getAll()
        });
      }
    });
  }

}
