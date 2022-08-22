import {Component, OnInit, ViewChild} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {CustomTableHeaderInfo} from '../../../data/interfaces/custom-table-header-info';
import {DropdownMenuInfo} from '../../../data/interfaces/dropdown-menu-info';

@Component({
  selector: 'app-params',
  templateUrl: './params.component.html',
  styleUrls: ['./params.component.scss']
})
export class ParamsComponent implements OnInit {
  allParams: any[] = [];
  public tableHeader: CustomTableHeaderInfo = {
    withBtn: true,
    btn: {
      bg: 'btn-primary',
      libelle: 'Nouveau paramètre',
    },
    btnClick: () => {
      document.getElementById('btnmodal').click();
    },
    title: 'Gestion des paramètres',
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
