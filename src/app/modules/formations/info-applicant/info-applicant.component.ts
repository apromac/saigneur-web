import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {NgbAccordionConfig} from '@ng-bootstrap/ng-bootstrap';
import moment from 'moment';
import {ParamsService} from '../../../core/services/params.service';
import {Candidat, CandidatDTO} from '../../../data/schemas/candidat';
import {InscriptionDTO, InscriptionModel} from '../../../data/schemas/inscription.model';

@Component({
  selector: 'app-info-applicant',
  templateUrl: './info-applicant.component.html',
  styleUrls: ['./info-applicant.component.scss']
})
export class InfoApplicantComponent implements OnInit {
  @Input() candidatInfo: CandidatDTO;
  @Input() btnIs: 'valider' | 'retirer' | 'none';
  @Output() validateClick = new EventEmitter<InscriptionDTO>();
  @Output() retirerClick = new EventEmitter<InscriptionDTO>();


  constructor(config: NgbAccordionConfig,
              private paramsService: ParamsService) {
    // customize default values of accordions used by this component tree
    config.closeOthers = true;
    config.type = 'info';

  }

  ngOnInit(): void {
  }

  // getAge() {
  //   // return this.candidatInfo.dateNaisCandidat;
  //   let year = new Date().getFullYear();
  //   let dN = new Date(this.candidatInfo.dateNaisCandidat).getFullYear();
  //   console.log(year, dN);
  //   return year - dN;
  // }


}
