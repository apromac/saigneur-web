import {HttpErrorResponse} from '@angular/common/http';
import {Component, OnInit, TemplateRef} from '@angular/core';
import {NgbModal, NgbOffcanvas} from '@ng-bootstrap/ng-bootstrap';
import {ToastrService} from 'ngx-toastr';
import Swal from 'sweetalert2';
import {ApplicationService} from '../../../core/services/application.service';
import {CampagneService} from '../../../core/services/campagne.service';
import {CustomTableHeaderInfo} from '../../../data/interfaces/custom-table-header-info';
import {DropdownMenuInfo} from '../../../data/interfaces/dropdown-menu-info';
import {Campagne} from '../../../data/schemas/campagne';
import {Candidat} from '../../../data/schemas/candidat';
import {NewApplicantComponent} from '../new-applicant/new-applicant.component';
import DismissReason from 'sweetalert2';

// import DismissReason = module;

@Component({
  selector: 'app-applicants',
  templateUrl: './applicants.component.html',
  styleUrls: ['./applicants.component.scss']
})
export class ApplicantsComponent implements OnInit {
  title = 'Candidats';
  public tableHeader: CustomTableHeaderInfo = {
    withBtn: true,
    btn: {
      bg: 'btn-primary',
      libelle: 'Inscrire',
    },
    btnClick: () => {
      this.startInscription();
    },
    title: this.title
  };

  allCampagnes: Campagne[] = [];
  allApplicants: Candidat[] = [];
  campagneSelected: Campagne;

  isLoading = false;
  constructor(private modalService: NgbModal, private offcanvasService: NgbOffcanvas,
              private candidatService: ApplicationService,
              private toast: ToastrService,
              private campagneService: CampagneService) {
  }

  ngOnInit(): void {
    this.fetchCombosData();
  }

  fetchCombosData(): void {
    this.campagneService.getAllCampagne().subscribe({
      next: (resp) => {
        this.allCampagnes = (resp as any as Campagne[]);
      },
      error: (err: HttpErrorResponse) => {
        console.log(err);
        this.toast.error('Une erreur s\'est produite', 'STATUS ' +err.status);
      },
      complete: () => {

      }
    });
  }

  comboCampagneChange(val: any): void {
    this.campagneSelected = this.allCampagnes.find((c) => c.campagneID === val);
    this.title = this.campagneSelected.libelleCampagne;
    this.tableHeader.title = this.title;
    this.getListApplicant();

  }

  getListApplicant() {
    if (!this.campagneSelected) {
      return;
    }
    this.isLoading = true;
    this.candidatService.getCdtByCampagneID(this.campagneSelected.campagneID).subscribe({
      next: (resp) => {
        this.allApplicants = resp as any as Candidat[];
        this.isLoading = false;
      },
      error: err => {
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  closeModal(): void {
    this.modalService.dismissAll();
  }

  startInscription(): void {

    const modalRef = this.modalService.open(NewApplicantComponent, {centered: true, size: 'lg', backdrop: 'static'});
    modalRef.componentInstance.name = 'World';

    // Swal.fire({
    //   title: 'INSCRIPTION D\'UN CANDIDAT',
    //   text: '',
    //   icon: 'question',
    //   showCloseButton : true,
    //   showCancelButton: true,
    //   confirmButtonColor: '#34c38f',
    //   cancelButtonColor: '#f46a6a',
    //   confirmButtonText: 'Nouveau candidat',
    //   cancelButtonText: 'Ancien Candidat!'
    // }).then(result => {
    //   console.log(result);
    //   if (result.value) {
    //     const modalRef = this.modalService.open(NewApplicantComponent, {centered: true, size: 'lg', backdrop : 'static'});
    //     modalRef.componentInstance.name = 'World';
    //   } else if (result.dismiss === Swal.DismissReason.cancel)  {
    //     document.getElementById('btnmodal').click();
    //     // DismissReason.getCloseButton().addEventListener( 'click', (r, )=> {
    //     //
    //     // })
    //   }
    // });
  }

  oldCandidat(cont): void {
    const modalRef = this.modalService.open(cont, {centered: true, size: 'xl', scrollable: true, backdrop: 'static'});
  }

  openEnd(content: TemplateRef<any>) {
    this.offcanvasService.open(content, {position: 'end'});
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
