import {Component, Input, OnInit} from '@angular/core';
import {TableHeaderInfo} from '../../../data/interfaces/table-header-info';
import {CustomTableHeaderInfo} from '../../../data/interfaces/custom-table-header-info';

@Component({
  selector: 'app-table-header',
  templateUrl: './table-header.component.html',
  styleUrls: ['./table-header.component.css']
})
export class TableHeaderComponent {
  @Input() header: CustomTableHeaderInfo = {
      title : '',
      withBtn : false,
      btn : {
          bg : 'btn-primary',
          libelle : '',
      }
  };

}


