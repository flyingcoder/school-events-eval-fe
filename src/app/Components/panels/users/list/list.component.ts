import { Component, OnInit } from '@angular/core';
import { UsersService } from '../../../../services/users/users.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  users;
  displayedColumns: string[] = ['id', 'name', 'contacts', 'actions'];

  constructor(
    private userSrv: UsersService
  ) { }

  ngOnInit() {
    this.getAll();
  }

  getAll() {

    this.userSrv.all().subscribe(users => {
      this.users = users
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
