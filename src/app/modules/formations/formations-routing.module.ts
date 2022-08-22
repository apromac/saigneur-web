import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ApplicantsComponent} from './applicants/applicants.component';
import {InterviewComponent} from './interview/interview.component';
import {LogsComponent} from './logs/logs.component';
import {PostSaigneursComponent} from './post-saigneurs/post-saigneurs.component';
import {ProducteursComponent} from './producteurs/producteurs.component';
import {SuccessApplicantsComponent} from './success-applicants/success-applicants.component';
import {ValidateApplicantsComponent} from './validate-applicants/validate-applicants.component';

const routes: Routes = [
    {
      path: 'applicants',
      data: {extraParameter: 'applicants'},
      component: ApplicantsComponent
    },
    {
      path: 'selection',
      data: {extraParameter: 'selection'},
      component: ValidateApplicantsComponent
    },
    {
      path: 'interview',
      data: {extraParameter: 'interview'},
      component: InterviewComponent
    },
    {
      path: 'validate',
      data: {extraParameter: 'validate'},
      component: SuccessApplicantsComponent
    },
  {
    path: 'logs',
    data: {extraParameter: 'logs'},
    component: LogsComponent
  },

    {
      path: 'post/saigneurs',
      data: {extraParameter: 'post-saigneurs'},
      component: PostSaigneursComponent
    },
    {
      path: 'post/producteurs',
      data: {extraParameter: 'post-producteur'},
      component: ProducteursComponent
    }
  ]
;

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FormationsRoutingModule {
}
