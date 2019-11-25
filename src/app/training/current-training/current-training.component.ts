import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { MatDialog } from '@angular/material';

import { StopTrainingComponent } from './stop-training.component';

@Component({
  selector: 'app-current-training',
  templateUrl: './current-training.component.html',
  styleUrls: ['./current-training.component.styl']
})

export class CurrentTrainingComponent implements OnInit {
  @Output() exitTraining = new EventEmitter();
  progress = 0;
  timer: number;

  constructor(private dialog: MatDialog) { }

  ngOnInit() {
    this.startTimer();
  }

  startTimer() {
    this.timer = setInterval(() => {
      this.progress = this.progress + 5;
      const stopTimer = this.progress >= 100;
      if (stopTimer) {
        clearInterval(this.timer);
      }
    }, 1000);
  }

  stopTraining() {
    const { progress } = this;
    clearInterval(this.timer);
    const dialogRef = this.dialog.open(StopTrainingComponent, {
      data: {
        progress
      }
    });

    dialogRef.afterClosed().subscribe(exitTraining => {
      if (exitTraining) {
        this.exitTraining.emit();
      } else {
        this.startTimer();
      }
    });
  }

}
