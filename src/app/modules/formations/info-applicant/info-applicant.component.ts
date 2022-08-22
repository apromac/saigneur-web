import { Component, OnInit } from '@angular/core';
import {NgbAccordionConfig} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-info-applicant',
  templateUrl: './info-applicant.component.html',
  styleUrls: ['./info-applicant.component.scss']
})
export class InfoApplicantComponent implements OnInit {

  constructor(config: NgbAccordionConfig) {
    // customize default values of accordions used by this component tree
    config.closeOthers = true;
    config.type = 'info';

  }
  ngOnInit(): void {
  }

}
