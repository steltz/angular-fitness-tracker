import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';

import { StopTrainingComponent } from './stop-training.component';
import { TrainingService } from '../training.service';

@Component({
  selector: 'app-current-training',
  templateUrl: './current-training.component.html',
  styleUrls: ['./current-training.component.styl']
})

export class CurrentTrainingComponent implements OnInit {
  progress = 0;
  timer: number;

  constructor(private dialog: MatDialog, private trainingService: TrainingService) { }

  ngOnInit() {
    this.startTimer();
  }

  startTimer() {
    const activeExercise = this.trainingService.getActiveExercise();
    const step = activeExercise.duration / 100 * 1000;
    this.timer = setInterval(() => {
      this.progress = this.progress + 1;
      const stopTimer = this.progress >= 100;
      if (stopTimer) {
        this.trainingService.completeExercise();
        clearInterval(this.timer);
      }
    }, step);
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
        this.trainingService.stopExercise(this.progress);
      } else {
        this.startTimer();
      }
    });
  }

}
