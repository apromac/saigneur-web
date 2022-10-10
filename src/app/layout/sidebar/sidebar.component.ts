import {Component, HostListener, OnInit} from '@angular/core';
import {select} from '@angular-redux/store';
import {Observable} from 'rxjs';
import {ActivatedRoute} from '@angular/router';
import {Utility} from '../../core/constants/utility';
import {MenuModel} from '../../data/schemas/menu.model';
import {ThemeOptions} from '../../theme-options';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent implements OnInit {
  public extraParameter: any;
  public date = Date.now();
  allMenus = Utility.loggedUser.menus;
  menuItems: MenuModel[] = [];

  constructor(public globals: ThemeOptions, private activatedRoute: ActivatedRoute) {
    console.log(this.allMenus);
  }

  @select('config') public config$: Observable<any>;

  private newInnerWidth: number;
  private innerWidth: number;
  activeId = 1;
  // activeId = 'dashboardsMenu';

  toggleSidebar() {
    this.globals.toggleSidebar = !this.globals.toggleSidebar;
  }

  sidebarHover() {
    this.globals.sidebarHover = !this.globals.sidebarHover;
  }

  ngOnInit() {
    setTimeout(() => {
      this.innerWidth = window.innerWidth;
      if (this.innerWidth < 1200) {
        this.globals.toggleSidebar = true;
      }
    });

    // this.extraParameter = this.activatedRoute.snapshot.firstChild.url;
    this.extraParameter = this.activatedRoute.snapshot.firstChild.data['extraParameter'];
    this.constructMenu();
  }
  // setExtra
  constructMenu(): void {
    this.menuItems = [];
    const niveau0 = this.allMenus.filter((m) => m.parentIdMenu === 0);
    niveau0.sort((m1, m2) => parseInt(m1.numeroOrdreMenu, 10) - parseInt(m2.numeroOrdreMenu, 10));
    niveau0.forEach((m) => {
      m.children = this.getSubMenu(m);
      this.menuItems.push(m);
    });

    console.error(this.menuItems);
  }

  getSubMenu(m: MenuModel): MenuModel[] {
    if (m.hasSousMenu) {
      let sm = this.allMenus.filter((mn) => mn.parentIdMenu === m.menuID);
      sm.sort((m1, m2) => parseInt(m1.numeroOrdreMenu, 10) - parseInt(m2.numeroOrdreMenu, 10));
      return sm.map((m) => {
        if (m.hasSousMenu) {
          m.children = this.getSubMenu(m);
        }
        return m;
      });
    } else {
      return [];
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.newInnerWidth = event.target.innerWidth;
    this.globals.toggleSidebar = this.newInnerWidth < 1200;

  }
}
