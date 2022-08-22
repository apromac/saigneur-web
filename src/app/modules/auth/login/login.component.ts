import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    const sessionState = localStorage.getItem('login');
    console.log(sessionState);
    if (sessionState === 'logged') {
      location.assign('./');
    }
  }

  login(): void {
    localStorage.setItem('login', 'logged');
    location.assign('./')
  }
}
