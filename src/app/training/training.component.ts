import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-training',
  templateUrl: './training.component.html',
  styleUrls: ['./training.component.styl']
})
export class TrainingComponent implements OnInit {
  activeTraining = false;

  constructor() { }

  ngOnInit() {
  }

}
