import {Component, OnInit, TemplateRef} from '@angular/core';
import {NgbOffcanvas} from '@ng-bootstrap/ng-bootstrap';
import {CustomTableHeaderInfo} from '../../../data/interfaces/custom-table-header-info';
import {DropdownMenuInfo} from '../../../data/interfaces/dropdown-menu-info';
import {Candidat} from '../../../data/schemas/candidat';
import {InfoApplicantComponent} from '../info-applicant/info-applicant.component';

@Component({
  selector: 'app-interview',
  templateUrl: './interview.component.html',
  styleUrls: ['./interview.component.scss']
})
export class InterviewComponent implements OnInit {

  public allApplicants;
  currentApplicant: Candidat;

  public tableHeader: CustomTableHeaderInfo = {
    withBtn: false,
    // btn: {
    //   bg: 'btn-primary',
    //   libelle: 'Nouveau candidat',
    // },
    title: 'Interview des candidats'
  };

  constructor(private offcanvasService: NgbOffcanvas) {
  }

  ngOnInit(): void {
  }

  openInfo(content: TemplateRef<any>) {
    let cn = this.offcanvasService.open(InfoApplicantComponent, {position: 'start'});
    cn.componentInstance.candidatInfo = this.currentApplicant;

    // this.offcanvasService.open(content, { position: 'start'});
  }


  openInterview(content: TemplateRef<any>) {
    this.offcanvasService.open(content, { position: 'end'});
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
      {
        title: 'Modifier',
        isMatDesign: false,
        icon: '',
        click: (item) => {
          console.log(item);
        }
      },
      {
        title: 'Supprimer',
        isMatDesign: false,
        icon: '',
        click: (item) => {
          console.log(item);
        }
      }
    ];
  }

}
