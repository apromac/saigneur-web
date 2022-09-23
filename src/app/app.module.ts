import {DevToolsExtension, NgRedux} from '@angular-redux/store';
import {CommonModule, HashLocationStrategy, LocationStrategy, registerLocaleData} from '@angular/common';
import {LOCALE_ID, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {NgChartsConfiguration, NgChartsModule} from 'ng2-charts';
import {PERFECT_SCROLLBAR_CONFIG, PerfectScrollbarConfigInterface} from 'ngx-perfect-scrollbar';
import {ToastrModule} from 'ngx-toastr';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {SearchBoxComponent} from './layout/header/elements/search-box/search-box.component';
import {UserBoxComponent} from './layout/header/elements/user-box/user-box.component';
import {HeaderComponent} from './layout/header/header.component';
import {SidebarComponent} from './layout/sidebar/sidebar.component';
import {SharedModule} from './shared/shared.module';
import {ArchitectUIState, rootReducer} from './ThemeOptions/store';
import {ConfigActions} from './ThemeOptions/store/config.actions';
import {ContentLayoutComponent} from './layout/content-layout/content-layout.component';
import {FooterComponent} from './layout/footer/footer.component';
import { DashboardComponent } from './modules/dashboard/dashboard.component';
import { InfoSaigneurComponent } from './layout/info-saigneur/info-saigneur.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import localFr from '@angular/common/locales/fr'

registerLocaleData(localFr);

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};

@NgModule({
  declarations: [
    AppComponent,

    /**
     * LAYOUT
     */
    SidebarComponent,
    ContentLayoutComponent,
    FooterComponent,
    UserBoxComponent,
    HeaderComponent,
    SearchBoxComponent,
    DashboardComponent,
    InfoSaigneurComponent,
  ],
  imports: [
    CommonModule,
    BrowserModule,
    NgbModule,
    SharedModule,
    AppRoutingModule,
    NgChartsModule,
    ToastrModule.forRoot(),
    BrowserAnimationsModule,
  ],
  providers: [
    {
      provide:
      PERFECT_SCROLLBAR_CONFIG,
      // DROPZONE_CONFIG,
      useValue:
      DEFAULT_PERFECT_SCROLLBAR_CONFIG,
      // DEFAULT_DROPZONE_CONFIG,
    },
    ConfigActions,
    { provide: LOCALE_ID, useValue: 'fr-FR' },
    { provide: NgChartsConfiguration, useValue: { generateColors: false }},
    {provide: LocationStrategy, useClass: HashLocationStrategy}
  ],
  bootstrap: [AppComponent]
})

export class AppModule {
  constructor(private ngRedux: NgRedux<ArchitectUIState>,
              private devTool: DevToolsExtension) {

    this.ngRedux.configureStore(
      rootReducer,
      {} as ArchitectUIState,
      [],
      [devTool.isEnabled() ? devTool.enhancer() : f => f]
    );

  }


}
