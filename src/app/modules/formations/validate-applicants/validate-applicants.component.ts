import {Component, OnInit, TemplateRef, ViewEncapsulation} from '@angular/core';
import {CustomTableHeaderInfo} from '../../../data/interfaces/custom-table-header-info';
import {DropdownMenuInfo} from '../../../data/interfaces/dropdown-menu-info';
import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-validate-applicants',
  templateUrl: './validate-applicants.component.html',
  styleUrls: ['./validate-applicants.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ValidateApplicantsComponent implements OnInit {

  public allApplicants;

  public tableHeader: CustomTableHeaderInfo = {
    withBtn: false,
    // btn: {
    //   bg: 'btn-primary',
    //   libelle: 'Nouveau candidat',
    // },
    title: 'Présélection campagne ' + new Date().getFullYear(),
  };

  constructor(private offcanvasService: NgbOffcanvas) {
  }

  ngOnInit(): void {
  }

  openEnd(content: TemplateRef<any>) {
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

  confirmValidation(): void {
    Swal.fire({
      title: 'Validation de candidat',
      text: 'Voulez-vous vraiment valider cette candidature?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#34c38f',
      cancelButtonColor: '#f46a6a',
      confirmButtonText: 'Oui!',
      cancelButtonText: 'Non!'
    }).then(result => {
      if (result.value) {

      }
    });
  }
}
