import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {PostSaigneursComponent} from '../formations/post-saigneurs/post-saigneurs.component';
import { MenuComponent } from './menu/menu.component';
import {ParamsComponent} from './params/params.component';
import {UsersComponent} from './users/users.component';

const routes: Routes = [
  {
    path: 'users',
    data: {extraParameter: 'users'},
    component: UsersComponent
  },
  {
    path: 'access',
    data: {extraParameter: 'access'},
    component: MenuComponent
  },

  {
    path: 'management',
    data: {extraParameter: 'params'},
    component: ParamsComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ParametresRoutingModule { }
