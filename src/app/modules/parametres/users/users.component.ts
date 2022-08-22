import {Component, OnInit} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {CustomTableHeaderInfo} from '../../../data/interfaces/custom-table-header-info';
import {DropdownMenuInfo} from '../../../data/interfaces/dropdown-menu-info';
import {TableHeaderInfo} from '../../../data/interfaces/table-header-info';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  public allUsers;

  public tableHeader: CustomTableHeaderInfo = {
    withBtn: true,
    btn: {
      bg: 'btn-primary',
      libelle: 'Nouvel utilisateur',
    },
    btnClick: () => {
      document.getElementById('btnmodal').click();
    },
    title: 'Liste des utilisateurs',
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
        title: 'Détails',
        isMatDesign: false,
        icon: '',
        click: (item) => {
          console.log(item);
        }
      }
    ];
  }
}
