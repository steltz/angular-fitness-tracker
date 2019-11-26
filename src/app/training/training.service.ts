import { Exercise } from "./exercise.model";

export class TrainingService {
  private availableExercises: Exercise[] = [
    { id: 'crunches', name: 'Crunches', duration: 30, calories: 10 },
    { id: 'touch-toes', name: 'Touch Toes', duration: 180, calories: 8 },
    { id: 'side-lunges', name: 'Side Lunges', duration: 120, calories: 8 },
    { id: 'burpees', name: 'Burpees', duration: 60, calories: 12 }
  ];

  getAvailableExercises() {
    return [ ...this.availableExercises ];
  }
}
