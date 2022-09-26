import {Component, OnInit, TemplateRef} from '@angular/core';
import {NgbOffcanvas} from '@ng-bootstrap/ng-bootstrap';
import {CustomTableHeaderInfo} from '../../../data/interfaces/custom-table-header-info';
import {DropdownMenuInfo} from '../../../data/interfaces/dropdown-menu-info';

@Component({
  selector: 'app-success-applicants',
  templateUrl: './success-applicants.component.html',
  styleUrls: ['./success-applicants.component.scss']
})
export class SuccessApplicantsComponent implements OnInit {


  public allApplicants;

  public tableHeader: CustomTableHeaderInfo = {
    withBtn: false,
    // btn: {
    //   bg: 'btn-primary',
    //   libelle: 'Nouveau candidat',
    // },
    title: 'Candidats retenus',
  };

  constructor(private offcanvasService: NgbOffcanvas) {
  }
  openEnd(content: TemplateRef<any>) {
    this.offcanvasService.open(content, { position: 'end'});
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
      },
    ];
  }
}
