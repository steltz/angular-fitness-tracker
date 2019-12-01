import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';

import { Exercise } from '../exercise.model';
import { TrainingService } from '../training.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-past-training',
  templateUrl: './past-training.component.html',
  styleUrls: ['./past-training.component.styl']
})

export class PastTrainingComponent implements OnInit, AfterViewInit, OnDestroy {
  displayedColumns = ['date', 'name', 'duration', 'calories', 'state'];
  dataSource = new MatTableDataSource<Exercise>();
  private exercisesChangedSubscription: Subscription;

  @ViewChild(MatSort, {static: false}) sort: MatSort;
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;

  constructor(private traingService: TrainingService) { }

  ngOnInit() {
    this.exercisesChangedSubscription = this.traingService
      .finishedExercisesChanged
      .subscribe(
        (exercises: Exercise[]) => {
          this.dataSource.data = exercises;
        }
      );
    this.traingService.fetchFinishedExercises();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  ngOnDestroy() {
    if (this.exercisesChangedSubscription) {
      this.exercisesChangedSubscription.unsubscribe();
    }
  }

  search(value: string) {
    this.dataSource.filter = value.trim().toLowerCase();
  }
}
