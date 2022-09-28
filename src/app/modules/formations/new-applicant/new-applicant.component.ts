import {CdkStepper} from '@angular/cdk/stepper';
import {HttpErrorResponse} from '@angular/common/http';
import {
  AfterContentInit,
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {NgbActiveModal, NgbModal, NgbTypeahead} from '@ng-bootstrap/ng-bootstrap';
import moment from 'moment';
import {ToastrService} from 'ngx-toastr';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  merge,
  Observable, of,
  OperatorFunction,
  Subject, switchMap,
  tap
} from 'rxjs';
import {CandidatService} from '../../../core/services/candidat.service';
import {ParamsService} from '../../../core/services/params.service';
import {PosteService} from '../../../core/services/poste.service';
import {ZoneService} from '../../../core/services/zone.service';
import {Campagne} from '../../../data/schemas/campagne';
import {Candidat} from '../../../data/schemas/candidat';
import {InscriptionModel} from '../../../data/schemas/inscription.model';
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
    console.log('Campagne====>', this.campagne, this.allCandidat);
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
        // this.listZone = (resp as any as ZoneApromac[])
      },
      error: (err) => {
        console.error(err);
      },
      complete: () => {
        console.log('complete');
      }
    });

    this.posteService.getPosteByProfil(4).subscribe({
      next: value => {
        console.log(value);
        this.listPostes = value as any as PosteModel[];
        this.posteChange(this.listPostes[0].posteID)
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
    this.zoneService.getAllZone().subscribe({
    // this.zoneService.getAllZoneByDistrict(idDistrict).subscribe({
      next: (resp) => {
        console.log(resp);
        this.listZone = (resp as any as ZoneApromac[]);
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
      nom: [''],
      prenom: [''],
      zoneInscription: ['', [Validators.required]],
      districtInscription: ['', [Validators.required]],
      // numero: [''],
    });


    this.idForm = this.fb.group({
      nomCandidat: ['', Validators.required],
      prenomsCandidat: ['', Validators.required],
      genreCandidat: [0, Validators.required],
      dateNaisCandidat: ['', Validators.required],
      lieuNaisCandidat: ['', Validators.required],
      niveauEtudeCandidat: [0, Validators.required],
      metierActuelCandidat: [0, Validators.required],
      lieuResidCandidat: [1, Validators.required],
      distanceEcoleCandidat: ['', Validators.required],
      premierContactCandidat: ['', Validators.required],
      secondContactCandidat: ['', Validators.required],
      typePieceCandidat: [0, Validators.required],
      numeroPieceCandidat: ['', Validators.required],
    });


    this.trainingForm = this.fb.group({
      isFormer : [false],
      structureFormation : [0],
      anneeFormation : ['', Validators.required],
      isAppliquer : [false],
      typeFormation : [0],
      typeSaigneFormation : [0],
      nomPlanteurFormation : ['', Validators.required],
      matriculePlanteurFormation : ['', Validators.required],
      contactPlanteurFormation : [''],
      lieuPlanteurFormation : ['', Validators.required],
      lieuFormation : ['', Validators.required],
      anneePlanteurFormation : ['', Validators.required],
    });
    //
    //
    this.jobForm = this.fb.group({
      isActivite: [false],
      nomPlanteurEmploi: ['', Validators.required],
      matriculePlanteurEmploi: ['', Validators.required],
      contactPlanteurEmploi: [''],
      lieuPlanteurEmploi: ['', Validators.required],
      anneePlanteurEmploi: ['', Validators.required],

      propositionEmploi: [false],
      nomPlanteurActivite: ['', Validators.required],
      matriculePlanteurActivite: ['', Validators.required],
      lieuPlanteurActivite: ['', Validators.required],
      anneePlanteurActivite: ['', Validators.required],
    });
    //
    //
    // this.motivationForm.reset();
    this.motivationForm = this.fb.group({
      motivation: ['', Validators.required]
    });


  }

  motivationChange(e): void {
    console.log(e);
    this.motivation = e;
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

  posteChange(id): void {
    this.posteService.getLocaliteByTDH(id).subscribe({
      next: (value : any) => {
        // this.posteSelected = value as any as PosteModel;
        console.log(this.posteSelected, value);
        this.localForm.controls['zoneInscription'].setValue(value.zoneTDH);
        this.localForm.controls['districtInscription'].setValue(value.districtTDH);
        this.getLieuResidence('');
      },
      error: (err: HttpErrorResponse) => {
        console.error(err);
        this.toast.error(err.error.message, 'STATUS ' + err.status);
      }
    });
  }

  saveForms(): void {
    console.log(this.idForm.value, this.localForm.value);
    let dataToSend = this.idForm.value;
    // Object.assign(dataToSend, ...this.localForm.value)
    let inscription = new InscriptionModel();
    inscription.campagneEntity = this.campagne;
    inscription.candidatEntity = this.idForm.value;
    inscription.inscriptionDTO = this.trainingForm.value
    inscription.inscriptionDTO.zoneInscription = this.localForm.controls['zoneInscription'].value;
    inscription.inscriptionDTO.districtInscription = this.localForm.controls['districtInscription'].value;
    // const motiv = this.motivationForm.value['motivation'].valeur
    inscription.inscriptionDTO.motivation = this.motivationForm.value['motivation'].valeur
   Object.assign(inscription.inscriptionDTO, this.jobForm.value)
    // inscription.inscriptionDTO.motivation = this.motivationForm.value;

    console.log(inscription);
    // return;
    this.candidatService.addCandidat(inscription).subscribe({
      next: value => {
        console.log(value);
        this.toast.success('Candidat inscrit avec succès');
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
