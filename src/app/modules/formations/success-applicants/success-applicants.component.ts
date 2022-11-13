import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {NgbOffcanvas} from '@ng-bootstrap/ng-bootstrap';
import {ToastrService} from 'ngx-toastr';
import {Observable} from 'rxjs';
import {Utility} from '../../../core/constants/utility';
import {GenderPipe} from '../../../core/pipes/gender.pipe';
import {CandidatService} from '../../../core/services/candidat.service';
import {PROFIL} from '../../../data/enums/profil';
import {STATUS_CANDIDAT} from '../../../data/enums/status';
import {CustomTableHeaderInfo} from '../../../data/interfaces/custom-table-header-info';
import {DropdownMenuInfo} from '../../../data/interfaces/dropdown-menu-info';
import {CandidatDTO} from '../../../data/schemas/candidat';
import {InscriptionDTO} from '../../../data/schemas/inscription.model';

@Component({
  selector: 'app-success-applicants',
  templateUrl: './success-applicants.component.html',
  styleUrls: ['./success-applicants.component.scss']
})
export class SuccessApplicantsComponent implements OnInit {
  @ViewChild('contentApplicant') contentApplicant: TemplateRef<any>;

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
    this.offcanvasService.open(content, {position: 'end'});
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
    let obs: Observable<any>;
    let status: STATUS_CANDIDAT = STATUS_CANDIDAT.ATTRIBUED   ;
    if (Utility.loggedUser.profilActuel === PROFIL.ADMIN) {
      obs = this.candidatService.getCdtByCampagneID(Utility.CURRENTCAMPAGNE.campagneID, status);
    } else {
      obs = this.candidatService.getAllCurrentCandidatByStatus(status);
    }
    obs.subscribe({
      next: value => {
        console.log(value);
        this.allApplicants = (value as any as CandidatDTO[])?.map((v) => {
          v.libelleGenre = new GenderPipe().transform(v.genreCandidat);
          v.nbrePoint = v.noteSprotif + v.noteOccupation + v.noteReveil + v.noteVelo + v.noteObscurite + v.noteCouche + v.noteLongueDistance + v.notePresencePlantation;
          // Object.assign(v, v.candidat);
          return v;
        }).sort((c1, c2)=> c2.nbrePoint - c1.nbrePoint);

        this.isLoading = false;
      }, error: err => {
        this.isLoading = false;
        this.toast.error(err.error.message, 'STATUS ' + err.status);
        console.error(err);
      }
    });
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
