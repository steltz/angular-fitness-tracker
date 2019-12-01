import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { UIService } from 'src/app/shared/ui.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.styl']
})

export class SignupComponent implements OnInit, OnDestroy {
  isLoading = false;
  private loadingSubscription: Subscription;

  constructor(private authService: AuthService, private uiService: UIService) {}

  ngOnInit() {
    this.initLoadingSubscription();
  }

  ngOnDestroy() {
    if (this.loadingSubscription) {
      this.loadingSubscription.unsubscribe();
    }
  }

  onSubmit(form: NgForm) {
    const { email, password } = form.value;
    this.authService.registerUser({
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
