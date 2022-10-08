import {HttpErrorResponse} from '@angular/common/http';
import {Component, OnInit, TemplateRef, ViewChild, ViewEncapsulation} from '@angular/core';
import {NgbOffcanvas} from '@ng-bootstrap/ng-bootstrap';
import {ToastrService} from 'ngx-toastr';
import Swal from 'sweetalert2';
import {GenderPipe} from '../../../core/pipes/gender.pipe';
import {CandidatService} from '../../../core/services/candidat.service';
import {STATUS_CANDIDAT} from '../../../data/enums/status';
import {CustomTableHeaderInfo} from '../../../data/interfaces/custom-table-header-info';
import {DropdownMenuInfo} from '../../../data/interfaces/dropdown-menu-info';
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
  isSelectedLoading = true;
  isNotSelectedLoading = true;
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
    let status : STATUS_CANDIDAT;
    if(selected) {
      this.isSelectedLoading =  true;
      status = STATUS_CANDIDAT.SELECTED;
      this.allApplicantsSelected =[];
    } else {
      this.allApplicants = [];
      status = STATUS_CANDIDAT.NEW_CANDIDAT;
      this.isNotSelectedLoading =  true;
    }
    this.candidatService.getAllCurrentCandidatByStatus(status).subscribe({
      next: value => {
        const list = ((value || [])  as any as InscriptionDTO[])?.map((c) => {
          let cdt = c;
          cdt.genreCandidat = new GenderPipe().transform(c.genreCandidat);
          return cdt;
        });
        if (!selected) {
          this.isNotSelectedLoading = false;
          this.allApplicants =  list;
          // list.forEach((o, index) => {
          //   this.allApplicants.push(o);
          //   Object.assign(this.allApplicants[index], o.candidat, o.campagne);
          // });
        } else {
          this.isSelectedLoading = false;
          this.allApplicantsSelected = list;
          // list.forEach((o, index) => {
          //   this.allApplicantsSelected.push(o);
          //   Object.assign(this.allApplicantsSelected[index], o.candidat, o.campagne);
          // });
          // this.allApplicantsSelected = list;
        }
        console.log(list);
      },
      error: (err: HttpErrorResponse) => {
        this.isSelectedLoading = false;
        this.isNotSelectedLoading = false;
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
    // this.openEnd()
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
            this.toast.success('Candidat retenu avec succès');
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
