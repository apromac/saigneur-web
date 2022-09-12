import {CdkStepperModule} from '@angular/cdk/stepper';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NgStepperModule} from 'angular-ng-stepper';
import {NgCircleProgressModule} from 'ng-circle-progress';
import {BsDatepickerModule} from 'ngx-bootstrap/datepicker';
import {SharedModule} from '../../shared/shared.module';

import {FormationsRoutingModule} from './formations-routing.module';
import {ApplicantsComponent} from './applicants/applicants.component';
import {NewApplicantComponent} from './new-applicant/new-applicant.component';
import {ValidateApplicantsComponent} from './validate-applicants/validate-applicants.component';
import {InterviewComponent} from './interview/interview.component';
import {PostSaigneursComponent} from './post-saigneurs/post-saigneurs.component';
import {SuccessApplicantsComponent} from './success-applicants/success-applicants.component';
import {ProducteursComponent} from './producteurs/producteurs.component';
import {InfoApplicantComponent} from './info-applicant/info-applicant.component';
import { LogsComponent } from './logs/logs.component';
import { InterviewDetailsComponent } from './interview-details/interview-details.component';


@NgModule({
  declarations: [
    ApplicantsComponent,
    NewApplicantComponent,
    ValidateApplicantsComponent,
    InterviewComponent,
    PostSaigneursComponent,
    SuccessApplicantsComponent,
    ProducteursComponent,
    InfoApplicantComponent,
    LogsComponent,
    InterviewDetailsComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    CdkStepperModule,NgStepperModule,
    FormationsRoutingModule,
    BsDatepickerModule.forRoot(),
    NgCircleProgressModule.forRoot({
      // set defaults here
      radius: 100,
      outerStrokeWidth: 16,
      innerStrokeWidth: 8,

      outerStrokeColor: '#008220',
      innerStrokeColor: '#85c55c',
      animationDuration: 300,
    })
  ]
})
export class FormationsModule {
}
