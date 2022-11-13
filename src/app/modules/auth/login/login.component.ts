import {HttpErrorResponse} from '@angular/common/http';
import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ToastrService} from 'ngx-toastr';
import {Utility} from '../../../core/constants/utility';
import {AuthService} from '../../../core/services/auth.service';
import {UserService} from '../../../core/services/user.service';
import {UsersModel} from '../../../data/schemas/users.model';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  isSendig = false;

  constructor(private fb: FormBuilder, private toast: ToastrService, private authService: UserService) {
  }

  ngOnInit(): void {
    // const sessionState = Utility.loggedUser;
    // console.log(sessionState);
    this.loginForm = this.fb
      .group({
        username: ['', [Validators.required, Validators.minLength(2)]],
        password: ['', [Validators.required, Validators.minLength(2)]],
      });
    // if (!sessionState) {
    //   location.assign('./');
    // }
  }

  login(): void {
    localStorage.setItem('login', 'logged');
    location.assign('./');
  }

  subMitForm($e): void {
    console.log($e);
    if (!$e || $e && (!$e.username || !$e.password)) {
      this.toast.error('Veuillez vérifier les champs');
      return;
    }
    this.isSendig = true;
    this.authService.auth($e).subscribe((resp) => {
      console.log(resp);
      sessionStorage.setItem('userlogged', JSON.stringify(resp));
      location.assign('./');
      Utility.loggedUser = resp as any as UsersModel;
      console.log(Utility.loggedUser);
      this.toast.success('Bienvenue ' + Utility.loggedUser?.nomUtilisateur, 'Connecté');
      this.isSendig = false;
    }, (err: HttpErrorResponse) => {
      this.isSendig = false;
      this.toast.error(err.error.message, 'STATUS ' + err.status);
      // this.login();
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
