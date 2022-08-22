import {select} from '@angular-redux/store';
import {animate, query, style, transition, trigger} from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import {Observable} from 'rxjs';
import {ThemeOptions} from '../../theme-options';
import {ConfigActions} from '../../ThemeOptions/store/config.actions';

@Component({
  selector: 'app-content-layout',
  templateUrl: './content-layout.component.html',
  styleUrls: ['./content-layout.component.scss'],
  // animations: [
  //
  //   trigger('architectUIAnimation', [
  //     transition('* <=> *', [
  //       query(':enter, :leave', [
  //         style({
  //           opacity: 0,
  //           display: 'flex',
  //           flex: '1',
  //           transform: 'translateY(-20px)',
  //           flexDirection: 'column'
  //
  //         }),
  //       ]),
  //       query(':enter', [
  //         animate('600ms ease', style({opacity: 1, transform: 'translateY(0)'})),
  //       ]),
  //
  //       query(':leave', [
  //         animate('600ms ease', style({opacity: 0, transform: 'translateY(-20px)'})),
  //       ], { optional: true })
  //     ]),
  //   ])
  // ]
})
export class ContentLayoutComponent implements OnInit {

  @select('config') public config$: Observable<any>;

  constructor(public globals: ThemeOptions, public configActions: ConfigActions) {
  }

  toggleSidebarMobile() {
    this.globals.toggleSidebarMobile = !this.globals.toggleSidebarMobile;
  }

  ngOnInit(): void {
  }

}
