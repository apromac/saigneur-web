import {CdkStepper} from '@angular/cdk/stepper';
import {HttpErrorResponse} from '@angular/common/http';
import {AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {NgbActiveModal, NgbModal, NgbTypeahead} from '@ng-bootstrap/ng-bootstrap';
import moment from 'moment';
import {ToastrService} from 'ngx-toastr';
import {debounceTime, distinctUntilChanged, filter, map, merge, Observable, OperatorFunction, Subject} from 'rxjs';
import {Utility} from '../../../core/constants/utility';
import {CandidatService} from '../../../core/services/candidat.service';
import {ParamsService} from '../../../core/services/params.service';
import {PosteService} from '../../../core/services/poste.service';
import {ZoneService} from '../../../core/services/zone.service';
import {PROFIL} from '../../../data/enums/profil';
import {STATUS_CANDIDAT} from '../../../data/enums/status';
import {Campagne} from '../../../data/schemas/campagne';
import {Candidat, CandidatDTO} from '../../../data/schemas/candidat';
import {InscriptionDTO, InscriptionModel} from '../../../data/schemas/inscription.model';
import {Params} from '../../../data/schemas/params';
import {PosteModel} from '../../../data/schemas/poste.model';
import {ZoneApromac} from '../../../data/schemas/zone-apromac';

@Component({
  selector: 'app-new-applicant',
  templateUrl: './new-applicant.component.html',
  styleUrls: ['./new-applicant.component.scss']
})
export class NewApplicantComponent implements OnInit, AfterViewInit {
  @ViewChild('cdkStepper') cdkStepper: CdkStepper;
  @Input() name;
  @Input() campagne: Campagne;
  @Input() inscription: CandidatDTO;
  @Input() allCandidat: Candidat[];
  @ViewChild('instance', {static: true}) instance: NgbTypeahead;

  @Output() inscriptionEnd = new EventEmitter<any>();

  _yearPickerCtrl: FormControl = new FormControl();
  localForm: FormGroup;
  idForm: FormGroup;
  trainingForm: FormGroup;
  jobForm: FormGroup;
  motivationForm: FormGroup;

  campgne: Campagne;
  candidat: Candidat;
  posteSelected: PosteModel = {};

  // campgne : Campagne;
  listCandidats: Candidat[] = [];
  listZone: ZoneApromac[] = [];
  listMotivations: Params[] = [];
  listPostes: PosteModel[] = [];

  touchUi = false;
  focus$ = new Subject<string>();
  click$ = new Subject<string>();
  currentIndex = 0;
  motivation: any;
  trained = false;
  practice = false;
  isActive = false;
  propositionEmploi = false;

  searchingCdt = false;
  searchCdtFailed = false;

  maxBirthday = moment().subtract({
    y: 5,
    day: 0
  }).format('YYYY-MM-DD');

  typePiece: 'attestation' | 'cni' | 'autre' = 'cni';
  typeFormations: any[] = ['Saigneur', 'Planteur', 'Autre'];
  allMotivations: any[] = ['Saigner votre propre plantation',
    'Saigner la plantation d\'un proche',
    // 'Exercer le métier de saigneur dans une autre plantation',
    // 'Contrôler la saignée dans votre plantation',
    // 'Autre',
  ];

  search: OperatorFunction<string, readonly string[]> = (text$: Observable<string>) => {
    const debouncedText$ = text$.pipe(debounceTime(200), distinctUntilChanged());
    const clicksWithClosedPopup$ = this.click$.pipe(filter(() => !this.instance.isPopupOpen()));
    const inputFocus$ = this.focus$;
    // const arrays = this.currentIndex === 5 ? this.allMotivations : this.typeFormations;
    return merge(debouncedText$, inputFocus$, clicksWithClosedPopup$).pipe(
      map(term => (term === '' ? this.typeFormations
        : this.typeFormations.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1)).slice(0, 10))
    );
  };

  motivationSearch: OperatorFunction<string, readonly Params[]> = (text$: Observable<string>) => {
    const debouncedText$ = text$.pipe(debounceTime(200), distinctUntilChanged());
    const clicksWithClosedPopup$ = this.click$.pipe(filter(() => !this.instance.isPopupOpen()));
    const inputFocus$ = this.focus$;

    return merge(debouncedText$, inputFocus$, clicksWithClosedPopup$).pipe(
      map(term => (term === '' ? this.listMotivations
        : this.listMotivations.filter(v => v.description.toLowerCase().indexOf((term as string).toLowerCase()) > -1)).slice(0, 10))
    );
  };
  formatter = (x: Params) => x.description;


  searchUser: OperatorFunction<string, readonly Candidat[]> = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      map(term => term === '' ? []
        : this.allCandidat
          .filter(v => v.nomCandidat.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
      // distinctUntilChanged(),
      // tap(() => this.searchingCdt = true),
      // switchMap(term =>
      //   // new Observable().pipe()
      //   this.candidatService.search(term).pipe(
      //     tap(() => this.searchCdtFailed = false),
      //     catchError(() => {
      //       this.searchCdtFailed = true;
      //       return of([]);
      //     }))
      // ),
      // tap(() => this.searchingCdt = false)
    );

  // applicantFormater = (x: Candidat) => x.nomCandidat;
  applicantFormater = (x: Candidat) => x.nomCandidat;
  currentYear = new Date().getFullYear();

  constructor(public activeModal: NgbActiveModal,
              private fb: FormBuilder,
              private modalService: NgbModal,
              private zoneService: ZoneService,
              private paramsService: ParamsService,
              private posteService: PosteService,
              private toast: ToastrService,
              private candidatService: CandidatService) {
  }

  ngOnInit(): void {
    this.fetchCombosData();
    console.log('Campagne====>', this.campagne, this.allCandidat, this.inscription);
    this.initForm();
    this.localForm.controls['poste'].valueChanges.subscribe((val) => {
      this.posteChange(val);

      // this.posteSelected = this.listPostes.find((p) => p.posteID == val);
      console.log(this.localForm);

    });
    // this.activeModal.
  }

  fetchCombosData() {
    /**
     * motivation
     */

    this.paramsService.getAllMotivation().subscribe({
      next: (resp) => {
        console.log(resp);
        this.listMotivations = (resp as Params[]);
        this.motivationForm.controls['motivation'].setValue(this.listMotivations[0]?.valeur);
        // this.listZone = (resp as any as ZoneApromac[])
      },
      error: (err) => {
        console.error(err);
      },
      complete: () => {
        console.log('complete');
      }
    });
    let obs: Observable<any>;
    if (Utility.loggedUser.profilActuel === PROFIL.ADMIN) {
      obs = this.posteService.getPosteByProfil(4);
    } else {
      obs = this.posteService.getLocaliteByDistrictAndProfil(4);
    }
    obs.subscribe({
      next: value => {
        console.log(value);
        this.listPostes = value as any as PosteModel[];
        // FOR EDIT
        var poste = this.listPostes.find((p) => p.zoneBean === this.inscription?.zoneInscription);
        this.localForm.controls['poste'].setValue(poste?.posteID);
        this.posteChange(poste?.posteID || this.listPostes[0]?.posteID);
      },
      error: (err: HttpErrorResponse) => {
        this.toast.error('Une erreur s\'est produite lors de la récupération des postes', 'STATUS ' + err.status);
        console.error(err);
      }
    });
  }

  getLieuResidence(idDistrict): void {
    /**
     * fill Zone
     */
    // this.zoneService.getAllZone().subscribe({
    this.zoneService.getAllZoneByDistrict(idDistrict).subscribe({
      next: (resp) => {
        console.log(resp);
        this.listZone = (resp as any as ZoneApromac[]);
        this.idForm.controls['lieuResidCandidat'].setValue(this.listZone[0]?.zoneID.toString());
      },
      error: (err) => {
        console.error(err);
      },
      complete: () => {
        console.log('complete');
      }
    });

  }

  initForm(): void {

    this.localForm = this.fb.group({
      poste: ['', [Validators.required]],
      zoneInscription: [this.inscription?.zoneInscription],
      districtInscription: [this.inscription?.districtInscription],
      // numero: [''],
    });


    this.idForm = this.fb.group({
      nomCandidat: [this.inscription?.nomCandidat, Validators.required],
      prenomsCandidat: [this.inscription?.prenomsCandidat, Validators.required],
      genreCandidat: [this.inscription?.genreCandidat || '0', Validators.required],
      dateNaisCandidat: [this.inscription?.dateNaisCandidat, Validators.required],
      lieuNaisCandidat: [this.inscription?.lieuNaisCandidat, Validators.required],
      niveauEtudeCandidat: [this.inscription?.niveauEtudeCandidat || '1', Validators.required],
      metierActuelCandidat: [this.inscription?.metierActuelCandidat || '1', Validators.required],
      lieuResidCandidat: [this.inscription?.lieuResidCandidat, Validators.required],
      distanceInscription: [this.inscription?.distanceInscription || '0'],
      premierContactCandidat: [this.inscription?.premierContactCandidat, Validators.required],
      secondContactCandidat: [this.inscription?.secondContactCandidat],
      typePieceCandidat: [this.inscription?.typePieceCandidat || '1', Validators.required],
      numeroPieceCandidat: [this.inscription?.numeroPieceCandidat, Validators.required],
    });

    this.trained = this.inscription?.isFormer || false;
    this.practice = this.inscription?.isAppliquer || false;
    this.trainingForm = this.fb.group({
      isFormer: [this.trained],
      structureFormation: [this.inscription?.structureFormation || '1'],
      anneeFormation: [this.splitDate(this.inscription?.anneeFormation), Validators.required],
      isAppliquer: [this.practice],
      typeFormation: [this.inscription?.typeFormation],
      typeSaigneFormation: [this.inscription?.typeSaigneFormation || '1'],
      nomPlanteurFormation: [this.inscription?.nomPlanteurFormation, Validators.required],
      matriculePlanteurFormation: [this.inscription?.matriculePlanteurFormation, Validators.required],
      contactPlanteurFormation: [this.inscription?.contactPlanteurFormation],
      lieuPlanteurFormation: [this.inscription?.lieuPlanteurFormation, Validators.required],
      lieuFormation: [this.inscription?.lieuFormation, Validators.required],
      anneePlanteurFormation: [this.splitDate(this.inscription?.anneePlanteurFormation), Validators.required],
    });


    //
    //
    this.isActive = this.inscription?.isActivite || false;
    this.propositionEmploi = this.inscription?.propositionEmploi || false;
    this.jobForm = this.fb.group({
      isActivite: [this.isActive],
      nomPlanteurEmploi: [this.inscription?.nomPlanteurEmploi, Validators.required],
      matriculePlanteurEmploi: [this.inscription?.matriculePlanteurEmploi, Validators.required],
      contactPlanteurEmploi: [this.inscription?.contactPlanteurEmploi],
      lieuPlanteurEmploi: [this.inscription?.lieuPlanteurEmploi, Validators.required],
      anneePlanteurEmploi: [this.splitDate(this.inscription?.anneePlanteurEmploi), Validators.required],

      propositionEmploi: [this.propositionEmploi],
      nomPlanteurActivite: [this.inscription?.nomPlanteurActivite, Validators.required],
      matriculePlanteurActivite: [this.inscription?.matriculePlanteurActivite, Validators.required],
      contactPlanteurActivite: [this.inscription?.contactPlanteurActivite, Validators.required],
      lieuPlanteurActivite: [this.inscription?.lieuPlanteurActivite, Validators.required],
      anneePlanteurActivite: [this.splitDate(this.inscription?.anneePlanteurActivite), Validators.required],
    });
    //
    //
    // this.motivationForm.reset();
    this.motivationForm = this.fb.group({
      motivation: [this.inscription?.motivation, Validators.required]
    });


  }

  posteChange(id): void {
    if (!id) {
      return;
    }
    this.posteService.getDTOById(id).subscribe({
      next: (value: any) => {
        // this.posteSelected = value as any as PosteModel;
        console.log(this.posteSelected, value);
        this.localForm.controls['zoneInscription'].setValue(value.zoneBean);
        // this.localForm.controls['zone'].setValue(value.zone);
        // this.localForm.controls['district'].setValue(value.district);
        this.localForm.controls['districtInscription'].setValue(value.districtBean);
        this.getLieuResidence(value.districtBean);
      },
      error: (err: HttpErrorResponse) => {
        console.error(err);
        this.toast.error(err.error.message, 'STATUS ' + err.status);
      }
    });
  }

  motivationChange(e): void {
    console.log(e);
    this.motivation = e;
    this.motivationForm.controls['motivation'].setValue(e);
  }

  alreadyTrainedChange(e): void {
    console.log(e);
    this.trained = e;
    // this.motivation = e;
  }

  trainedAndPractice(e): void {
    console.log(e);
    this.practice = e;
    // this.motivation = e;
  }


  ngAfterViewInit(): void {

    this.cdkStepper.selectionChange.subscribe((c) => {
      console.log(c, this.cdkStepper._getFocusIndex());
      this.currentIndex = c.selectedIndex;

    });
  }

  getRangeDate(e): void {
    console.log(e);
  }

  typePieceChange($e): void {
    console.log($e);
    this.typePiece = $e;
  }

  resetPracticeForm() {
    if (!this.practice) {
      this.trainingForm.controls['isAppliquer'].setValue(false);
      this.trainingForm.controls['typeFormation'].setValue(null);
      this.trainingForm.controls['typeSaigneFormation'].setValue(null);
      this.trainingForm.controls['nomPlanteurFormation'].setValue(null);
      this.trainingForm.controls['matriculePlanteurFormation'].setValue(null);
      this.trainingForm.controls['contactPlanteurFormation'].setValue(null);
      this.trainingForm.controls['lieuPlanteurFormation'].setValue(null);
      this.trainingForm.controls['lieuFormation'].setValue(null);
      this.trainingForm.controls['anneePlanteurFormation'].setValue(null);
    }
  }
  splitDate(field: string) {
    if(!field) {
      return null;
    }
   return  field.split('-')[0];
  }
  setDate(field: string): string {
    if (field) {
      if (field.length > 4) {
        return field;
      }
      return field + '-01-01';
    }
    return null;
  }

  saveForms(): void {
    /**
     * FOR UPDATE, USE InscriptionDTO
     *
     * FOR NWRECORD, USE InscriptionModel
     */
    console.log(this.idForm.value, this.localForm.value);
    // Object.assign(dataToSend, ...this.localForm.value)
    let inscription = new InscriptionModel();
    let obs: Observable<any>;

    if (!this.trained) {
      this.trainingForm.reset();
      this.trainingForm.controls['isFormer'].setValue(false);
      this.trainingForm.controls['isAppliquer'].setValue(false);
    } else {
      this.resetPracticeForm();
    }

    if (!this.jobForm.value['propositionEmploi']) {
      this.jobForm.controls['propositionEmploi'].setValue(false);
      this.jobForm.controls['nomPlanteurEmploi'].setValue(null);
      this.jobForm.controls['matriculePlanteurEmploi'].setValue(null);
      this.jobForm.controls['contactPlanteurEmploi'].setValue(null);
      this.jobForm.controls['lieuPlanteurEmploi'].setValue(null);
      this.jobForm.controls['anneePlanteurEmploi'].setValue(null);
    }

    if (!this.jobForm.value['isActivite']) {
      this.jobForm.controls['isActivite'].setValue(false);
      this.jobForm.controls['nomPlanteurActivite'].setValue(null);
      this.jobForm.controls['matriculePlanteurActivite'].setValue(null);
      this.jobForm.controls['lieuPlanteurActivite'].setValue(null);
      this.jobForm.controls['anneePlanteurActivite'].setValue(null);
      this.jobForm.controls['contactPlanteurActivite'].setValue(null);
    }

    /**
     * Here is for update
     */
    if (this.inscription && this.inscription.inscriptionID) {
      inscription.inscriptionDTO = this.inscription;
      var insc = inscription.inscriptionDTO;
      insc.campagne = this.campagne || Utility.CURRENTCAMPAGNE;
      insc.motivation = this.motivationForm.value['motivation'];
      insc.candidat = this.idForm.value;
      insc.candidat.nomCandidat = insc.candidat.nomCandidat.toLocaleUpperCase();

      insc.statut = STATUS_CANDIDAT.NEW_CANDIDAT;
      Object.assign(insc, this.trainingForm.value, this.jobForm.value, this.localForm.value);
      insc.distanceInscription = this.idForm.value['distanceInscription'];
      insc.anneeFormation = this.setDate(insc.anneeFormation);
      insc.anneePlanteurEmploi = this.setDate(insc.anneePlanteurEmploi);
      insc.anneePlanteurFormation = this.setDate(insc.anneePlanteurFormation);
      insc.anneePlanteurActivite = this.setDate(insc.anneePlanteurActivite);
      obs = this.candidatService.updateCandidat(insc);
    } else {
      inscription.candidatEntity = this.idForm.value;
      inscription.campagneEntity = this.campagne || Utility.CURRENTCAMPAGNE;
      inscription.inscriptionDTO = new InscriptionDTO();
      inscription.inscriptionDTO.statut = STATUS_CANDIDAT.NEW_CANDIDAT;
      inscription.inscriptionDTO.dateInscription = moment().format('YYYY-MM-DD');
      inscription.inscriptionDTO.distanceInscription = this.idForm.value['distanceInscription'];

      Object.assign(inscription.inscriptionDTO, this.jobForm.value,
        this.trainingForm.value, this.localForm.value, this.motivationForm.value);

      inscription.inscriptionDTO.anneeFormation = this.setDate(inscription.inscriptionDTO.anneeFormation);
      inscription.inscriptionDTO.anneePlanteurEmploi = this.setDate(inscription.inscriptionDTO.anneePlanteurEmploi);
      inscription.inscriptionDTO.anneePlanteurFormation = this.setDate(inscription.inscriptionDTO.anneePlanteurFormation);
      inscription.inscriptionDTO.anneePlanteurActivite = this.setDate(inscription.inscriptionDTO.anneePlanteurActivite);
      obs = this.candidatService.addCandidat(inscription);
    }

    console.log(inscription);
    // return;
    obs.subscribe({
      next: value => {
        console.log(value);
        this.toast.success('Enregistrement effectué avec succès');
        this.inscriptionEnd.emit(true);
        this.activeModal.dismiss(true);
      },
      error: (err: HttpErrorResponse) => {
        console.log(err);
        this.toast.error(err.error.message, 'STATUS ' + err.status);
      }
    });

    // console.log(dataToSend);
  }
}
