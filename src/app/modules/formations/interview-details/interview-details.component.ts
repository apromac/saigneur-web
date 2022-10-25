import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {InscriptionDTO} from '../../../data/schemas/inscription.model';
import {InterviewModel} from '../../../data/schemas/interview.model';

@Component({
  selector: 'app-interview-details',
  templateUrl: './interview-details.component.html',
  styleUrls: ['./interview-details.component.scss']
})
export class InterviewDetailsComponent implements OnInit {
  @Output() validateClick = new EventEmitter<any>();
  @Output() openInfo : EventEmitter<any> = new EventEmitter<any>();

  @Input() candidatInterview : InscriptionDTO;
  constructor() { }

  ngOnInit(): void {
  }

  getNote(): number {
    let note = this.candidatInterview.noteCouche +
    this.candidatInterview.noteObscurite+
    this.candidatInterview.noteReveil+
    this.candidatInterview.noteVelo+
    this.candidatInterview.noteSprotif+
    this.candidatInterview.noteOccupation+
    this.candidatInterview.noteLongueDistance+
    this.candidatInterview.notePresencePlantation;


    return  (note * 100)/20 ;
  }

}
