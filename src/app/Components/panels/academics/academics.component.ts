import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-academics',
  templateUrl: './academics.component.html',
  styleUrls: ['./academics.component.scss']
})
export class AcademicsComponent implements OnInit {

  activePanel: string = 'colleges';

  constructor() { }

  ngOnInit() {
  }

  navigate(item: string){
    this.activePanel = item;
  }

}
