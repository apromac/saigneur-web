import {HttpErrorResponse} from '@angular/common/http';
import {Component, OnInit, TemplateRef, ViewEncapsulation} from '@angular/core';
import {Toast, ToastrService} from 'ngx-toastr';
import {CandidatService} from '../../../core/services/candidat.service';
import {CustomTableHeaderInfo} from '../../../data/interfaces/custom-table-header-info';
import {DropdownMenuInfo} from '../../../data/interfaces/dropdown-menu-info';
import {NgbOffcanvas} from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import {Candidat} from '../../../data/schemas/candidat';
import {InscriptionDTO} from '../../../data/schemas/inscription.model';


@Component({
  selector: 'app-validate-applicants',
  templateUrl: './validate-applicants.component.html',
  styleUrls: ['./validate-applicants.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ValidateApplicantsComponent implements OnInit {

  public allApplicants: InscriptionDTO[] = [];
  public allApplicantsSelected: InscriptionDTO[] = [];
  currentCandidat: InscriptionDTO;
  btnToShow: 'valider' | 'retirer' | 'none' = 'valider';
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
    this.getListCandidat(false);
    this.getListCandidat(true);
  }

  getListCandidat(selected: boolean): void {
    this.candidatService.getAllCurrentCandidatByStatus(selected).subscribe({
      next: value => {
        const list = (value as any as InscriptionDTO[]).map((c) => {
          let cdt = c;
          cdt.candidat.genreCandidat = c.candidat.genreCandidat == '0' ? 'Masculin' : 'Féminin';
          return cdt;
        });
        if (!selected) {
          this.allApplicants = [];
          list.forEach((o, index) => {
            this.allApplicants.push(o);
            Object.assign(this.allApplicants[index], o.candidat, o.campagne);
          });
        } else {
          list.forEach((o, index) => {
            this.allApplicantsSelected.push(o);
            Object.assign(this.allApplicantsSelected[index], o.candidat, o.campagne);
          });
          // this.allApplicantsSelected = list;
        }
        console.log(list);
      },
      error: (err: HttpErrorResponse) => {
        this.toast.error(err.error.message, 'STATUS ' + err.status);
        console.error(err);
      }
    });
  }

  tableRowClicked(cdt: InscriptionDTO, selected: boolean): void {
    this.currentCandidat = cdt;
    if (selected) {
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
          this.currentCandidat = item;
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
          this.currentCandidat = item;
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

  confirmValidation(c: InscriptionDTO): void {
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
        this.candidatService.validateCandidat({
          status: true,
          inscriptionID: c.inscriptionID,
        }).subscribe({
          next: valeur => {
            this.toast.success('Candidat validé avec succès');
            let i = this.allApplicants.findIndex((i) => i.inscriptionID === c.inscriptionID);
            this.allApplicants.splice(i, 1);
            if (this.allApplicants && this.allApplicants.length > 0) {
              this.currentCandidat = this.allApplicants[0];
            } else {
              this.currentCandidat = null;
              window.scrollTo({top : 100000, behavior: 'smooth'});
            }
            this.getListCandidat(true);
          }, error: err => {
            console.log(err);
            this.toast.error(err.error.message, 'STATUS ' + err.status);
          }
        });
      }
    });
  }

  retirerCandidat(c: InscriptionDTO): void {
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
        this.candidatService.validateCandidat({
          status: false,
          inscriptionID: c.inscriptionID,
        }).subscribe({
          next: valeur => {
            this.toast.success('Candidat rétiré avec succès');
            let i = this.allApplicantsSelected.findIndex((i) => i.inscriptionID === c.inscriptionID);
            this.allApplicantsSelected.splice(i, 1);
            if (this.allApplicantsSelected && this.allApplicantsSelected.length > 0) {
              this.currentCandidat = this.allApplicantsSelected[0];
            } else {
              this.currentCandidat = null;
              window.scrollTo({top : 0, behavior: 'smooth'});
            }
            this.getListCandidat(false);
          }, error: err => {
            console.log(err)
            this.toast.error(err.error.message, 'STATUS ' + err.status);
          }
        });
      }
    });
  }
}
