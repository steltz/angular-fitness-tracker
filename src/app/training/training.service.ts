import { AngularFirestore } from '@angular/fire/firestore';
import { Subject, Subscription } from 'rxjs';
import { Exercise } from './exercise.model';
import { Injectable } from '@angular/core';
import { UIService } from '../shared/ui.service';

@Injectable()
export class TrainingService {
  exerciseChanged = new Subject<Exercise>();
  exercisesChanged = new Subject<Exercise[]>();
  finishedExercisesChanged = new Subject<Exercise[]>();
  private availableExercises: Exercise[] = [];
  private activeExercise: Exercise;
  private firebaseSubscriptions: Subscription[] = [];

  constructor(private db: AngularFirestore, private uiService: UIService) {}

  async fetchAvailableExercises() {
    this.firebaseSubscriptions.push(
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
        }, err => {
          this.uiService.showSnackbar(
            'Failed to fetch exercises, please try again later',
            null,
            3000
          );
        }));
  }

  fetchFinishedExercises() {
    this.firebaseSubscriptions.push(
      this.db
        .collection('finishedExercises')
        .valueChanges()
        .subscribe((exercises: Exercise[]) => {
          this.finishedExercisesChanged.next(exercises);
        })
      );
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

  cancelSubscriptions() {
    this.firebaseSubscriptions.forEach(sub => sub.unsubscribe());
  }

  getActiveExercise() {
    return { ...this.activeExercise };
  }

  private saveExercise(exercise: Exercise) {
    this.db.collection('finishedExercises').add(exercise);
  }
}
