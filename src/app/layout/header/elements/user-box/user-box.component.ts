import {Component, OnInit} from '@angular/core';
import {Utility} from '../../../../core/constants/utility';
import {ThemeOptions} from '../../../../theme-options';

@Component({
  selector: 'app-user-box',
  templateUrl: './user-box.component.html',
})
export class UserBoxComponent implements OnInit {

  userConnected = Utility.loggedUser;
  constructor(public globals: ThemeOptions) {
  }

  ngOnInit() {
  }
  logout(): void {
    sessionStorage.clear();
    location.assign('/');
  }
}
