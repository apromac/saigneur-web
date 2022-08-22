import { Component, OnInit } from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {CustomTableHeaderInfo} from '../../../data/interfaces/custom-table-header-info';
import {DropdownMenuInfo} from '../../../data/interfaces/dropdown-menu-info';

@Component({
  selector: 'app-producteurs',
  templateUrl: './producteurs.component.html',
  styleUrls: ['./producteurs.component.scss']
})
export class ProducteursComponent implements OnInit {
  public allApplicants;

  public tableHeader: CustomTableHeaderInfo = {
    withBtn: true,
    btn: {
      bg: 'btn-primary',
      libelle: 'Nouvel enregistrement',
    },
    btnClick: () => {
      document.getElementById('btnmodal').click();
    },
    title: 'Producteurs demandeurs de saigneurs',
  };

  constructor(private modalService: NgbModal) {
  }
  ngOnInit(): void {
  }

  openModal(modal): void{
    const modalRef = this.modalService.open(modal, {centered: true, size:'lg', backdrop: 'static'});
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
