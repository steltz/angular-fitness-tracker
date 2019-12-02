import { Subject } from 'rxjs/Subject';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { AuthData } from './auth-data.model';

import { AngularFireAuth } from '@angular/fire/auth';

import { TrainingService } from '../training/training.service';
import { UIService } from '../shared/ui.service';
import { Store } from '@ngrx/store';
import * as fromApp from '../app.reducer';

@Injectable()
export class AuthService {
  authChange = new Subject<boolean>();
  private isAuthenticated = false;

  constructor(
    private router: Router,
    private afAuth: AngularFireAuth,
    private trainingService: TrainingService,
    private uiService: UIService,
    private store: Store<{ui: fromApp.State}>
  ) {}

  initAuthListener() {
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.isAuthenticated = true;
        this.authChange.next(true);
        this.router.navigate(['/training']);
      } else {
        this.trainingService.cancelSubscriptions();
        this.authChange.next(false);
        this.router.navigate(['/login']);
        this.isAuthenticated = false;
      }
    });
  }

  async registerUser(authData: AuthData) {
    try {
      const { email, password } = authData;
      // this.uiService.loadingStateChanged.next(true);
      this.store.dispatch({ type: 'START_LOADING' });
      await this.afAuth
        .auth
        .createUserWithEmailAndPassword(email, password);
      // this.uiService.loadingStateChanged.next(false);
      this.store.dispatch({ type: 'STOP_LOADING' });
    } catch (err) {
      // this.uiService.loadingStateChanged.next(false);
      this.store.dispatch({ type: 'STOP_LOADING' });
      this.uiService.showSnackbar(err.message, null, 3000);
    }
  }

  async login(authData: AuthData) {
    try {
      const { email, password } = authData;
      // this.uiService.loadingStateChanged.next(true);
      this.store.dispatch({ type: 'START_LOADING' });
      await this.afAuth
        .auth.
        signInWithEmailAndPassword(email, password);
      // this.uiService.loadingStateChanged.next(false);
      this.store.dispatch({ type: 'STOP_LOADING' });
    } catch (err) {
      // this.uiService.loadingStateChanged.next(false);
      this.store.dispatch({ type: 'STOP_LOADING' });
      this.uiService.showSnackbar(err.message, null, 3000);
    }
  }

  logout() {
    this.afAuth.auth.signOut();
  }

  isAuth() {
    return this.isAuthenticated;
  }
}
