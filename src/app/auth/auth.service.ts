import { Subject } from 'rxjs/Subject';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { User } from './user.model';
import { AuthData } from './auth-data.model';

import { AngularFireAuth } from '@angular/fire/auth';

import { TrainingService } from '../training/training.service';

@Injectable()
export class AuthService {
  authChange = new Subject<boolean>();
  private isAuthenticated = false;

  constructor(
    private router: Router,
    private afAuth: AngularFireAuth,
    private trainingService: TrainingService
  ) {}

  async registerUser(authData: AuthData) {
    const { email, password } = authData;
    try {
      await this.afAuth
        .auth
        .createUserWithEmailAndPassword(email, password);
      this.authSuccess();
    } catch (err) {
      console.log(err);
    }
  }

  async login(authData: AuthData) {
    const { email, password } = authData;
    try {
      await this.afAuth
        .auth.
        signInWithEmailAndPassword(email, password);
      this.authSuccess();
    } catch (err) {
      console.log(err);
    }
  }

  logout() {
    this.trainingService.cancelSubscriptions();
    this.afAuth.auth.signOut();
    this.authChange.next(false);
    this.router.navigate(['/login']);
    this.isAuthenticated = false;
  }

  isAuth() {
    return this.isAuthenticated;
  }

  private authSuccess() {
    this.isAuthenticated = true;
    this.authChange.next(true);
    this.router.navigate(['/training']);
  }
}
