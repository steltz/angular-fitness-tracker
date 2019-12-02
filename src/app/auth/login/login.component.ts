import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { UIService } from 'src/app/shared/ui.service';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../app.reducer';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.styl']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  isLoading$: Observable<boolean>;
  private loadingSubscription: Subscription;

  constructor(
    private authService: AuthService,
    private uiService: UIService,
    private store: Store<fromRoot.State>
  ) {}

  ngOnInit() {
    this.initLoadingSubscription();
    this.loginForm = new FormGroup({
      email: new FormControl('', {
        validators: [Validators.required, Validators.email]
      }),
      password: new FormControl('', { validators: [Validators.required] })
    });
  }

  // ngOnDestroy() {
  //   if (this.loadingSubscription) {
  //     this.loadingSubscription.unsubscribe();
  //   }
  // }

  onSubmit() {
    const { email, password } = this.loginForm.value;
    this.authService.login({
      email,
      password
    });
  }

  initLoadingSubscription() {
    this.isLoading$ = this.store.select(fromRoot.getIsLoading);
    // this.loadingSubscription = this.uiService
    //   .loadingStateChanged
    //   .subscribe(isLoading => {
    //     this.isLoading = isLoading;
    //   });
  }
}
