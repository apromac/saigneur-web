import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SharedModule} from '../../shared/shared.module';

import { ParametresRoutingModule } from './parametres-routing.module';
import { UsersComponent } from './users/users.component';
import { MenuComponent } from './menu/menu.component';
import { ParamsComponent } from './params/params.component';


@NgModule({
  declarations: [
    UsersComponent,
    MenuComponent,
    ParamsComponent
  ],
    imports: [
        // CommonModule,
        ParametresRoutingModule,
        SharedModule
    ]
})
export class ParametresModule { }
