// import {NgReduxModule} from '@angular-redux/store';
import {NgReduxModule} from '@angular-redux/store';
import {HttpClientModule} from '@angular/common/http';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {LoadingBarModule} from '@ngx-loading-bar/core';
import {PerfectScrollbarModule} from 'ngx-perfect-scrollbar';
import {FqPaginationPipe} from '../core/pipes/fq-pagination.pipe';
import {ListSaigneursComponent} from '../layout/list-saigneurs/list-saigneurs.component';
import {CustomInputComponent} from './components/custom-input/custom-input.component';
import {CustomTableComponent} from './components/custom-table/custom-table.component';
import {HeadComponent} from './components/head/head.component';
import {LoadingComponent} from './components/loading/loading.component';
import {NotFoundComponent} from './components/not-found/not-found.component';
import {TableHeaderComponent} from './components/table-header/table-header.component';
import {TableLoadingComponent} from './components/table-loading/table-loading.component';


@NgModule({
  declarations: [
    FqPaginationPipe,
    LoadingComponent,
    CustomTableComponent,
    CustomInputComponent,
    HeadComponent,
    NotFoundComponent,
    TableLoadingComponent,
    TableHeaderComponent,
    ListSaigneursComponent
  ],
  exports : [
    CommonModule,
    // BrowserAnimationsModule,
    // NoopAnimationsModule,
    FqPaginationPipe,
    LoadingComponent,
    CustomTableComponent,
    HeadComponent,
    CustomInputComponent,
    NotFoundComponent,
    TableLoadingComponent,
    TableHeaderComponent,
    NgReduxModule,
    PerfectScrollbarModule,
    LoadingBarModule,

    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,

    ListSaigneursComponent,

  ],
  imports: [
    CommonModule,
    // BrowserAnimationsModule,
    // NoopAnimationsModule,
    NgReduxModule,
    PerfectScrollbarModule,

    NgbModule,
    LoadingBarModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
  ]
})
export class SharedModule { }
