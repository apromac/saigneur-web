import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {NgbOffcanvas} from '@ng-bootstrap/ng-bootstrap';
import {ToastrService} from 'ngx-toastr';
import {Utility} from '../../../core/constants/utility';
import {CandidatService} from '../../../core/services/candidat.service';
import {CustomTableHeaderInfo} from '../../../data/interfaces/custom-table-header-info';
import {DropdownMenuInfo} from '../../../data/interfaces/dropdown-menu-info';
import {InscriptionDTO} from '../../../data/schemas/inscription.model';
import {InterviewModel} from '../../../data/schemas/interview.model';

@Component({
  selector: 'app-success-applicants',
  templateUrl: './success-applicants.component.html',
  styleUrls: ['./success-applicants.component.scss']
})
export class SuccessApplicantsComponent implements OnInit {
  @ViewChild('contentApplicant') contentApplicant : TemplateRef<any>;

  public allApplicants: InscriptionDTO[] = [];
  public currentCandidat: InscriptionDTO;
  currentCampagne = Utility.CURRENTCAMPAGNE;

  isLoading = true;

  public tableHeader: CustomTableHeaderInfo = {
    withBtn: false,
    // btn: {
    //   bg: 'btn-primary',
    //   libelle: 'Nouveau candidat',
    // },
    title: 'Candidats retenus',
  };
  openEnd(content: TemplateRef<any>) {
    this.offcanvasService.open(content, { position: 'end'});
  }

  constructor(private offcanvasService: NgbOffcanvas,
              private toast: ToastrService,
              private candidatService: CandidatService) {
  }

  ngOnInit(): void {
    this.getCandidatRetenu();
  }

  getCandidatRetenu(): void {
    this.isLoading = true;
    this.allApplicants = [];
    this.candidatService.getCandidatRetenu().subscribe({
      next : value => {
        console.log(value);
        this.allApplicants = (value as any as InscriptionDTO[]).map((v)=>{
          v.candidat.genreCandidat = v.candidat.genreCandidat === '0'? 'Masculin' : 'Féminin'
          Object.assign(v, v.candidat);
          return v;
        });

        this.isLoading = false;
      }, error : err => {
        this.isLoading = false;
        this.toast.error(err.error.message, 'STATUS '+ err.status);
        console.error(err);
      }
    })
  }
  getMenus(): DropdownMenuInfo[] {
    return [
      {
        title: 'Détails',
        isMatDesign: true,
        icon: 'info',
        color: 'primary',
        click: (item) => {
          this.currentCandidat = item;
          this.openEnd(this.contentApplicant);
          console.log(item);
        }
      },
    ];
  }
}
