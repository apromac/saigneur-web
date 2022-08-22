import { Component, OnInit } from '@angular/core';
import {CustomTableHeaderInfo} from '../../../data/interfaces/custom-table-header-info';
import {DropdownMenuInfo} from '../../../data/interfaces/dropdown-menu-info';

@Component({
  selector: 'app-post-saigneurs',
  templateUrl: './post-saigneurs.component.html',
  styleUrls: ['./post-saigneurs.component.scss']
})
export class PostSaigneursComponent implements OnInit {

  public allApplicants;

  public tableHeader: CustomTableHeaderInfo = {
    withBtn: false,
    title: 'Saigneurs placés chez les producteurs'
  };

  constructor() {
  }

  ngOnInit(): void {
  }

  getMenus(): DropdownMenuInfo[] {
    return [
      {
        title: 'Voir plus',
        isMatDesign: false,
        icon: '',
        click: (item) => {
          console.log(item);
        }
      }
    ];
  }
}
