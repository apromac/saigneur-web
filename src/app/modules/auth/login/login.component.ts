import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../../core/services/auth.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  isSendig = false;

  constructor(private fb: FormBuilder, private authService: AuthService) {
  }

  ngOnInit(): void {
    const sessionState = localStorage.getItem('login');
    console.log(sessionState);
    this.loginForm = this.fb
      .group({
        username: ['', [Validators.required, Validators.minLength(2)]],
        password: ['', [Validators.required, Validators.minLength(2)]],
      });
    if (sessionState === 'logged') {
      location.assign('./');
    }
  }

  login(): void {
    localStorage.setItem('login', 'logged');
    location.assign('./');
  }

  subMitForm($e): void {
    console.log($e);
    this.isSendig = true;
    this.authService.connect($e).subscribe((resp) => {
      console.log(resp);
      this.isSendig = false;
    }, (err) => {
      this.isSendig = false;
      this.login();
      console.log(err);
    });
  }

}


export class LoginDto {
  private _username;
  private _password;

  constructor(username, password) {
    this._username = username;
    this._password = password;
  }

  get username() {
    return this._username;
  }

  set username(value) {
    this._username = value;
  }

  get password() {
    return this._password;
  }

  set password(value) {
    this._password = value;
  }
}
