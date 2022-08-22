import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AuthGuard} from './core/guards/auth.guard';
import {ContentLayoutComponent} from './layout/content-layout/content-layout.component';
import {LoginComponent} from './modules/auth/login/login.component';
import {DashboardComponent} from './modules/dashboard/dashboard.component';

const routes: Routes = [

  {
    canActivate : [
      AuthGuard
    ],
    path: '',
    component: ContentLayoutComponent,
    children: [
      {
        path: '',
        data: {extraParameter: 'dashboardsMenu'},
        component: DashboardComponent
      },
      {
        path: 'params',
        data: {extraParameter: 'params'},
        loadChildren: () => import('./modules/parametres/parametres.module').then((m) => m.ParametresModule)
      },
      {
        path: 'training',
        data: {extraParameter: 'training'},
        loadChildren: () => import('./modules/formations/formations.module').then((m) => m.FormationsModule)
      }
    ]
  },
  {
    // canActivate: [AuthGuard],
    path: 'login',
    loadChildren: () => import('./modules/auth/auth.module').then((m) => m.AuthModule)
  },
  // {
  //   path: '',
  //   redirectTo: '/',
  //   pathMatch: 'full'
  // },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
