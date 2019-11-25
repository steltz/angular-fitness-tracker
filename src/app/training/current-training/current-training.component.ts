import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';

import { StopTrainingComponent } from './stop-training.component';

@Component({
  selector: 'app-current-training',
  templateUrl: './current-training.component.html',
  styleUrls: ['./current-training.component.styl']
})
export class CurrentTrainingComponent implements OnInit {
  progress = 0;
  timer: number;

  constructor(private dialog: MatDialog) { }

  ngOnInit() {
    this.timer = setInterval(() => {
      this.progress = this.progress + 5;
      const stopTimer = this.progress >= 100;
      if (stopTimer) {
        clearInterval(this.timer);
      }
    }, 1000);
  }

  stopTraining() {
    clearInterval(this.timer);
    this.dialog.open(StopTrainingComponent);
  }

}
