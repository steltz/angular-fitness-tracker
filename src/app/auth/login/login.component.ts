import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { UIService } from 'src/app/shared/ui.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.styl']
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm: FormGroup;
  isLoading = false;
  private loadingSubscription: Subscription;

  constructor(
    private authService: AuthService,
    private uiService: UIService
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

  ngOnDestroy() {
    this.loadingSubscription.unsubscribe();
  }

  onSubmit() {
    const { email, password } = this.loginForm.value;
    this.authService.login({
      email,
      password
    });
  }

  initLoadingSubscription() {
    this.loadingSubscription = this.uiService
      .loadingStateChanged
      .subscribe(isLoading => {
        this.isLoading = isLoading;
      });
  }
}
