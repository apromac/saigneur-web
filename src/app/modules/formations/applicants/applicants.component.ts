import {Component, OnInit, TemplateRef} from '@angular/core';
import {NgbModal, NgbOffcanvas} from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import {CustomTableHeaderInfo} from '../../../data/interfaces/custom-table-header-info';
import {DropdownMenuInfo} from '../../../data/interfaces/dropdown-menu-info';
import {NewApplicantComponent} from '../new-applicant/new-applicant.component';
import DismissReason from 'sweetalert2';
// import DismissReason = module;

@Component({
  selector: 'app-applicants',
  templateUrl: './applicants.component.html',
  styleUrls: ['./applicants.component.scss']
})
export class ApplicantsComponent implements OnInit {
  public allApplicants;
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

  constructor(private modalService: NgbModal, private offcanvasService: NgbOffcanvas) {
  }

  ngOnInit(): void {
  }
  comboCampagneChange(val: any): void {
    this.title = 'Campagne ' + val;
    this.tableHeader.title = this.title;
  }

  closeModal(): void {
    this.modalService.dismissAll();
  }
  startInscription(): void {

    const modalRef = this.modalService.open(NewApplicantComponent, {centered: true, size: 'lg', backdrop : 'static'});
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
    const modalRef = this.modalService.open(cont, {centered: true, size:'xl', scrollable: true, backdrop: 'static'});
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
}
