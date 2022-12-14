// import {NgReduxModule} from '@angular-redux/store';
import {NgReduxModule} from '@angular-redux/store';
import {HttpClientModule} from '@angular/common/http';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatNativeDateModule} from '@angular/material/core';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatFormFieldModule} from '@angular/material/form-field';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {NgSelectModule} from '@ng-select/ng-select';
import {LoadingBarModule} from '@ngx-loading-bar/core';
import {PerfectScrollbarModule} from 'ngx-perfect-scrollbar';
import {AgePipe} from '../core/pipes/age.pipe';
import {BoolValPipe} from '../core/pipes/bool-val.pipe';
import {FqPaginationPipe} from '../core/pipes/fq-pagination.pipe';
import {GenderPipe} from '../core/pipes/gender.pipe';
import {ParamsPipe} from '../core/pipes/params.pipe';
import {SaignePipe} from '../core/pipes/saigne.pipe';
import {ListSaigneursComponent} from '../layout/list-saigneurs/list-saigneurs.component';
import {CustomInputComponent} from './components/custom-input/custom-input.component';
import {CustomTableComponent} from './components/custom-table/custom-table.component';
import {HeadComponent} from './components/head/head.component';
import {LoadingComponent} from './components/loading/loading.component';
import {NotFoundComponent} from './components/not-found/not-found.component';
import {TableHeaderComponent} from './components/table-header/table-header.component';
import {TableLoadingComponent} from './components/table-loading/table-loading.component';
import { YearPickerComponent } from './components/year-picker/year-picker.component';



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
    ListSaigneursComponent,
    YearPickerComponent,
    GenderPipe,
    BoolValPipe,
    AgePipe,
    SaignePipe,
    ParamsPipe,
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
    NgSelectModule,

    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,

    ListSaigneursComponent,
    YearPickerComponent,
    MatFormFieldModule,
    MatNativeDateModule,
    GenderPipe,
    BoolValPipe,
    AgePipe,
    BoolValPipe,
    SaignePipe,
    ParamsPipe,
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
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    NgSelectModule,
  ]
})
export class SharedModule { }
