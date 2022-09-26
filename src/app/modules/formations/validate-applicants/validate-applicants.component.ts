import {HttpErrorResponse} from '@angular/common/http';
import {Component, OnInit, TemplateRef, ViewEncapsulation} from '@angular/core';
import {Toast, ToastrService} from 'ngx-toastr';
import {CandidatService} from '../../../core/services/candidat.service';
import {CustomTableHeaderInfo} from '../../../data/interfaces/custom-table-header-info';
import {DropdownMenuInfo} from '../../../data/interfaces/dropdown-menu-info';
import {NgbOffcanvas} from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import {Candidat} from '../../../data/schemas/candidat';
import {InscriptionModel} from '../../../data/schemas/inscription.model';


@Component({
  selector: 'app-validate-applicants',
  templateUrl: './validate-applicants.component.html',
  styleUrls: ['./validate-applicants.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ValidateApplicantsComponent implements OnInit {

  public allApplicants: Candidat[] = [];
  currentCandidat: Candidat;
  btnToShow: 'valider' | 'retirer' | 'none' = 'valider'
  public tableHeader: CustomTableHeaderInfo = {
    withBtn: false,
    // btn: {
    //   bg: 'btn-primary',
    //   libelle: 'Nouveau candidat',
    // },
    title: 'Sélection des candidats',
  };

  constructor(private offcanvasService: NgbOffcanvas,
              private toast: ToastrService,
              private candidatService: CandidatService) {
  }

  ngOnInit(): void {
    this.getListCandidat();
  }

  getListCandidat(selected : boolean = false): void {
    this.candidatService.getAllCurrentCandidat(selected).subscribe({
      next: value => {
        this.allApplicants = (value as any as Candidat[]).map((c)=> {
          let cdt = c;
          cdt.libelleGenre = c.genreCandidat == '0' ? 'Masculin':'Féminin'
          return  cdt;
        });

      },
      error: (err: HttpErrorResponse) => {
        this.toast.error(err.error.message, 'STATUS ' + err.status);
        console.error(err);
      }
    });
  }
  tableRowClicked(cdt: Candidat, selected : boolean): void {
    this.currentCandidat = cdt;
    if(selected) {
      this.btnToShow = 'retirer';
    } else {
      this.btnToShow = 'valider';
    }
    console.log(cdt);
  }
  openEnd(content: TemplateRef<any>) {
    this.offcanvasService.open(content, {position: 'end'});
  }

  getMenus(): DropdownMenuInfo[] {
    return [
      {
        title: 'Valider',
        isMatDesign: true,
        icon: 'user-check',
        color: 'green',
        click: (item) => {
          this.currentCandidat =  item;
          console.log(item);
        }
      },
      // {
      //   title: 'Détails',
      //   isMatDesign: false,
      //   icon: '',
      //   click: (item) => {
      //     console.log(item);
      //   }
      // },
      // {
      //   title: 'Supprimer',
      //   isMatDesign: false,
      //   icon: '',
      //   click: (item) => {
      //     console.log(item);
      //   }
      // }
    ];
  }
 getMenusSelected(): DropdownMenuInfo[] {
    return [
      {
        title: 'Retirer',
        isMatDesign: true,
        icon: 'user-check',
        color: 'green',
        click: (item) => {
          this.currentCandidat =  item;
          console.log(item);
        }
      },
      // {
      //   title: 'Détails',
      //   isMatDesign: false,
      //   icon: '',
      //   click: (item) => {
      //     console.log(item);
      //   }
      // },
      // {
      //   title: 'Supprimer',
      //   isMatDesign: false,
      //   icon: '',
      //   click: (item) => {
      //     console.log(item);
      //   }
      // }
    ];
  }

  confirmValidation(c: Candidat): void {
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
  retirerCandidat(c: Candidat): void {
    Swal.fire({
      title: 'Retrait de candidat',
      text: 'Voulez-vous vraiment retirer cette candidature?',
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
