import { Subject } from 'rxjs/Subject';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { User } from './user.model';
import { AuthData } from './auth-data.model';

import { AngularFireAuth } from '@angular/fire/auth';

import { isEmpty } from 'lodash';

@Injectable()
export class AuthService {
  authChange = new Subject<boolean>();
  private user: User;

  constructor(private router: Router, private afAuth: AngularFireAuth) {}

  async registerUser(authData: AuthData) {
    const { email, password } = authData;
    try {
      const user = await this.afAuth
        .auth
        .createUserWithEmailAndPassword(email, password);
      console.log(user);
      this.authSuccess();
    } catch (err) {
      console.log(err);
    }
  }

  async login(authData: AuthData) {
    const { email, password } = authData;
    try {
      const user = await this.afAuth
        .auth.
        signInWithEmailAndPassword(email, password);
      console.log(user);
      this.authSuccess();
    } catch (err) {
      console.log(err);
    }
  }

  logout() {
    this.user = null;
    this.authChange.next(false);
    this.router.navigate(['/login']);
  }

  getUser() {
    return { ...this.user };
  }

  isAuth() {
    return this.user != null || !isEmpty(this.user);
  }

  private authSuccess() {
    this.authChange.next(true);
    this.router.navigate(['/training']);
  }
}
