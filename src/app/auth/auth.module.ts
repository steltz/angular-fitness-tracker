import { NgModule } from '@angular/core';

import { AngularFireAuthModule } from '@angular/fire/auth';
import { AuthRoutingModule } from './auth-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';

import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';

@NgModule({
  declarations: [
    LoginComponent,
    SignupComponent
  ],
  imports: [
    AngularFireAuthModule,
    AuthRoutingModule,
    ReactiveFormsModule,
    SharedModule
  ]
})

export class AuthModule {}
