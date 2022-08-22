import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {CustomTableHeaderInfo} from '../../../data/interfaces/custom-table-header-info';
import {DropdownMenuInfo} from '../../../data/interfaces/dropdown-menu-info';
import {NewApplicantComponent} from '../new-applicant/new-applicant.component';

@Component({
  selector: 'app-logs',
  templateUrl: './logs.component.html',
  styleUrls: ['./logs.component.scss']
})
export class LogsComponent implements OnInit {

  public allApplicants;
  @ViewChild('nwcampagne') nwcampagne : any;

  public tableHeader: CustomTableHeaderInfo = {
    withBtn: true,
    btn: {
      bg: 'btn-primary',
      libelle: 'Nouvelle campagne',
    },
    btnClick: () => {
      document.getElementById('btnmodal').click();
    },
    title: 'Historique des campagnes',
  };

  constructor(private modalService: NgbModal) {
  }

  ngOnInit(): void {
  }
  openModal(modal): void{
    const modalRef = this.modalService.open(modal, {centered: true, backdrop: 'static'});
    // modalRef.componentInstance.name = 'World';
  }

  close(): void{
    this.modalService.dismissAll();
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
