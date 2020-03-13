import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  activePanel: string = '';
  user;
  ready = false;

  constructor(
    private router: Router,
    private authSrv: AuthService
  ) { }

  ngOnInit() {
    this.authSrv.me().subscribe(user => {
      this.user = user
      localStorage.setItem('user', this.user.id);
      localStorage.setItem('type', this.user.type);
      this.ready = true
    });
  }

  navigate(item: string){
    this.router.navigate([item]);
    this.activePanel = item;
  }

  logout(){
    this.authSrv.logout().subscribe(data => {
      console.log(data);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('type');
      window.location.reload(false);
    });
  }

  acronym(name){
    return name.substring(0,1);
  }

}
