import { AngularFirestore } from '@angular/fire/firestore';
import { Subject } from 'rxjs/Subject';
import { Exercise } from './exercise.model';
import { Injectable } from '@angular/core';

@Injectable()
export class TrainingService {
  exerciseChanged = new Subject<Exercise>();
  exercisesChanged = new Subject<Exercise[]>();
  finishedExercisesChanged = new Subject<Exercise[]>();
  private availableExercises: Exercise[] = [];
  private activeExercise: Exercise;

  constructor(private db: AngularFirestore) {}

  fetchAvailableExercises() {
    this.db
      .collection('availableExercises')
      .snapshotChanges()
      .map(docArray => {
        return docArray.map(doc => {
          return {
            id: doc.payload.doc.id,
            ...doc.payload.doc.data()
          };
        });
      })
      .subscribe((exercises: Exercise[]) => {
        this.availableExercises = exercises;
        this.exercisesChanged.next([...this.availableExercises]);
      });
  }

  fetchFinishedExercises() {
    this.db
      .collection('finishedExercises')
      .valueChanges()
      .subscribe((exercises: Exercise[]) => {
        this.finishedExercisesChanged.next(exercises);
      });
  }

  startExercise(selectedId: string) {
    this.activeExercise = this.availableExercises.find(ex => ex.id === selectedId);
    this.exerciseChanged.next({ ...this.activeExercise });
  }

  completeExercise() {
    this.saveExercise({
      ...this.activeExercise,
      date: new Date(),
      state: 'completed'
    });
    this.activeExercise = null;
    this.exerciseChanged.next(null);
  }

  stopExercise(progress: number) {
    this.saveExercise({
      ...this.activeExercise,
      duration: this.activeExercise.duration * (progress / 100),
      calories: this.activeExercise.calories * (progress / 100),
      date: new Date(),
      state: 'stopped'
    });
    this.activeExercise = null;
    this.exerciseChanged.next(null);
  }

  getActiveExercise() {
    return { ...this.activeExercise };
  }

  private saveExercise(exercise: Exercise) {
    this.db.collection('finishedExercises').add(exercise);
  }
}
