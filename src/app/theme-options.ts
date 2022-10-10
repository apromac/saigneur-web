import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeOptions {
  sidebarHover = false;
  toggleSidebar = true;
  toggleSidebarMobile = false;
  toggleHeaderMobile = false;
  toggleFixedFooter = false;
}
