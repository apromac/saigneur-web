import {HttpErrorResponse} from '@angular/common/http';
import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ToastrService} from 'ngx-toastr';
import {ProfilService} from 'src/app/core/services/profil.service';
import {PosteService} from '../../../core/services/poste.service';
import {UserService} from '../../../core/services/user.service';
import {CustomTableHeaderInfo} from '../../../data/interfaces/custom-table-header-info';
import {DropdownMenuInfo} from '../../../data/interfaces/dropdown-menu-info';
import {TableHeaderInfo} from '../../../data/interfaces/table-header-info';
import {PosteModel} from '../../../data/schemas/poste.model';
import {UsersModel} from '../../../data/schemas/users.model';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  public allUsers: UsersModel[] = [];
  public allPoste: PosteModel[] = [];
  isLoading = false;

  currentUser: UsersModel = {};

  formGroup: FormGroup;

  constructor(private modalService: NgbModal,
              private fb: FormBuilder,
              private posteService: PosteService,
              private profilService: ProfilService,
              private userService: UserService, private toast: ToastrService) {
  }

  ngOnInit(): void {
    this.getAllUser();
  }

  public tableHeader: CustomTableHeaderInfo = {
    withBtn: true,
    btn: {
      bg: 'btn-primary',
      libelle: 'Nouvel utilisateur',
    },
    btnClick: () => {
      document.getElementById('btnmodal').click();
    },
    title: 'Liste des utilisateurs',
  };

  initForm(): void {
    this.formGroup = this.fb.group({
      nomUtilisateur: ['', Validators.required],
      prenomsUtilisateur: ['', Validators.required],
      password: ['', Validators.required],
      confPassword: ['', Validators.required],
      poste: ['', Validators.required],
      username: ['', Validators.required],
    });
  }

  getAllUser(): void {
    this.isLoading = true;
    this.allUsers = [];
    this.userService.getAllUser().subscribe({
      next: (resp) => {
        console.log(resp);
        this.allUsers = (resp as any as UsersModel[]).map((u) => {
            let user = u;
            user.postLabel = (u as any).profil?.libelleProfil;
            // user.postLabel = u.poste?.libellePoste
            return user;
          }
        );
      }, error: (err: HttpErrorResponse) => {
        this.toast.error(err.message, 'STATUS ' + err.status);
        console.error(err);
      }
    });
  }

  getAllPost(): void {
    this.posteService.getAllPoste().subscribe({
      next: value => {
        console.log(value);
        this.allPoste = value as any as PosteModel[];
      }
    });
  }

  openModal(modal): void {
    this.initForm();
    this.getAllPost();
    const modalRef = this.modalService.open(modal, {centered: true, size: 'lg', backdrop: 'static'});
    // modalRef.componentInstance.name = 'World';
  }

  close(): void {
    console.log(this.formGroup.value);
    // this.modalService.dismissAll();
  }

  getMenus(): DropdownMenuInfo[] {
    return [
      {
        title: 'Détails',
        isMatDesign: true,
        className: 'h3',
        icon: 'info',
        color: 'info',
        click: (item) => {
          console.log(item);
        }
      }
    ];
  }

  saveUser(): void {
    console.log(this.formGroup);
    this.userService.createUser(this.formGroup.value).subscribe({
      next: value => {
        console.log(value);
        this.toast.success('Utilisateur ajouté avec succès', 'Création d\'utilisateur');
      },
      error: (err: HttpErrorResponse) => {
        console.log(err);
        this.toast.error(err.message, 'STATUS' + err.status);
      },
      complete : () => {

      }
    });
  }
}
