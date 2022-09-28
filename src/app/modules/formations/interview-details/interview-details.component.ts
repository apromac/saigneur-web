import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {InterviewModel} from '../../../data/schemas/interview.model';

@Component({
  selector: 'app-interview-details',
  templateUrl: './interview-details.component.html',
  styleUrls: ['./interview-details.component.scss']
})
export class InterviewDetailsComponent implements OnInit {
  @Output() validateClick = new EventEmitter<any>();
  @Output() openInfo : EventEmitter<any> = new EventEmitter<any>();

  @Input() candidatInterview : InterviewModel | any;
  constructor() { }

  ngOnInit(): void {
  }

}
