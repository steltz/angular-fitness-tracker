import { Subject } from 'rxjs/Subject';
import { Exercise } from './exercise.model';

export class TrainingService {
  exerciseChanged = new Subject<Exercise>();
  private availableExercises: Exercise[] = [
    { id: 'crunches', name: 'Crunches', duration: 30, calories: 10 },
    { id: 'touch-toes', name: 'Touch Toes', duration: 180, calories: 8 },
    { id: 'side-lunges', name: 'Side Lunges', duration: 120, calories: 8 },
    { id: 'burpees', name: 'Burpees', duration: 60, calories: 12 }
  ];
  private activeExercise: Exercise;
  private exercises: Exercise[] = [];

  getAvailableExercises() {
    return [ ...this.availableExercises ];
  }

  startExercise(selectedId: string) {
    this.activeExercise = this.availableExercises.find(ex => ex.id === selectedId);
    this.exerciseChanged.next({ ...this.activeExercise });
  }

  completeExercise() {
    this.exercises.push({
      ...this.activeExercise,
      date: new Date(),
      state: 'completed'
    });
    this.activeExercise = null;
    this.exerciseChanged.next(null);
  }

  stopExercise(progress: number) {
    this.exercises.push({
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

  getExercises() {
    return [ ...this.exercises ];
  }
}
