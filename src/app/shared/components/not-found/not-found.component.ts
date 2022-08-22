import {Component, Input, OnInit, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss']
})
export class NotFoundComponent implements OnInit {
  @Input() message: any;
  @Input() btnTitle;
  @Output() refresh = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  refreshClick(e): void {
    this.refresh.emit(e);
  }

}
