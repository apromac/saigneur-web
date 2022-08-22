// import { AfterContentChecked, AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {Component, EventEmitter, Input, OnInit, Output, TrackByFunction} from '@angular/core';
import {DropdownMenuInfo} from '../../../data/interfaces/dropdown-menu-info';
import {SearchBoxInfo} from '../../../data/interfaces/search-box-info';
import {TableHeaderInfo} from '../../../data/interfaces/table-header-info';
import {TableRowInfo} from '../../../data/interfaces/table-row-info';
import {CustomTableHeaderInfo} from '../../../data/interfaces/custom-table-header-info';

@Component({
  selector: 'app-custom-table',
  templateUrl: './custom-table.component.html',
  styleUrls: ['./custom-table.component.scss']
})
export class CustomTableComponent implements OnInit {
  @Output() actualiser = new EventEmitter();
  @Output() rowClicked = new EventEmitter();
  @Input() header: CustomTableHeaderInfo | undefined;
  @Input() tableData: any[] | undefined;
  @Input() tableHeader: TableHeaderInfo[] | any[] | undefined;
  @Input() tableHeaderWithInfo: { libelle: any, size?: any }[] | undefined;
  @Input() tableRow: TableRowInfo[] | any[] | undefined;
  @Input() lastRow: any;
  @Input() item: any;
  @Input() notFoundMsg: string | undefined;
  @Input() isLoading = false;
  @Input() withoutHeader = false;
  @Input() allSearchBox: SearchBoxInfo[] | undefined;
  @Input() searchWithBtn = false;
  @Input() searchWithCriteras = true;
  @Input() colSize = 8;
  // Menus en bas de la table au cas où il y en a
  @Input() bottomMenus: DropdownMenuInfo[] | undefined;
  // Si true le menu en bas sera affiché
  // @Input() backBtn: boolean = false;
  @Input() withouSearch = false;

  /**
   * If true the user can select multiple rows by checking the checkbox on the row
   */
  @Input() multiselectRow = false;

  @Output() rowCheckedListener = new EventEmitter();

  @Input() rowSelectedLength = 0;
  allCheck = false;

  searchCriterias: { checked: any, column: any }[] | undefined;

  /**
   *
   */
  @Output() tableFetchEndListener = new EventEmitter();
  // Tab pagination configuration
  @Input() config: {
    currentPage?: number,
    itemsPerPage?: number
  } = {
    currentPage: 1,
    itemsPerPage: 10
  };

  // Pour activer les rowspan et colspan
  @Input() hasRowColSpan = false;
  // @Input() rowsOnPage = 10;
  value: any;

  // Liste des boutons dasns actions
  @Input() menus: DropdownMenuInfo[] | undefined;

  @Input() searchChange: any;
  _currentIndex = 0;
  @Input() searchWithOtherComponent = false;
  hasCriterias = false;

  /**
   * you don't have to set this field yourself
   */
  @Input() searchList: any[] | undefined;
  private checking: { checked: any; column: any; }[] | undefined;

  constructor() {
    // this.searchList = Utility.deepCopy(this.tableData);


  }

  ngOnInit() {
    if (!this.searchList || this.searchList && this.searchList.length <= 0)
      this.searchList = this.tableData;
    this.searchCriterias = [];
    if (!this.config) {
      this.config = {
        currentPage: 1,
        itemsPerPage: 10
      };
    } else {
      if (this.config && !this.config.itemsPerPage) {
        this.config.itemsPerPage = 10;
      }
      if (this.config && !this.config.currentPage) {
        this.config.currentPage = 1;
      }
    }
    // @ts-ignore
    for (let r of this.tableRow) {
      this.searchCriterias.push({
        checked: false,
        column: r.libelle || r
      });
    }
    // console.log(this.searchCriterias);

  }

  public onClick(event: Event): void {
    event.stopPropagation();
  }

  getPagination(): any[] {
    return Array(Math.floor(this.searchList.length / this.config.itemsPerPage));
  }

  reload(val): void {
    this.actualiser.emit(val);
  }

  onChange(valSaisie): void {
    const val = valSaisie?.toLowerCase();
    // console.log(val, " ", this.value)
    // console.log(this.allChecked())
    // console.log('searchList', this.searchList, 'tableData', this.tableData);
    if (val.length > 0 && this.searchList) {
      let rowSearch = this.tableRow;
      if (this.checking && this.checking.length > 0) {
        rowSearch = this.checking.map((c) => c.column);
        console.log(rowSearch);
      }

      // @ts-ignore
      this.tableData = this.searchList.filter((data) => {
          if (!data) {
            return false;
          }
          // console.log('2');

          for (let i = 0; i < rowSearch.length; i++) {
            const row = (data[rowSearch[i] + ''] && data[rowSearch[i] + '']);
            if (!row) {
              continue;
            }
            if (row?.toString().toLowerCase().indexOf(val) !== -1) {
              return true;
            } else {
              continue;
            }

          }

        }
      );
    } else {
      this.tableData = this.searchList;

    }

  }

  pageChanged(event): void {
    console.log(event);
    var go = event.replace('#!', '');

    var paginationPage = parseInt($('.cdp').attr('actpage'), 10);

    console.log(go);
    if (go === '+1') {
      paginationPage++;
    } else if (go === '-1') {
      paginationPage--;
    } else {
      paginationPage = parseInt(go, 10);
    }

    this.config.currentPage = paginationPage;
    // @ts-ignore
    const currentLotStart = (this.config.currentPage * this.config.itemsPerPage) - this.config.itemsPerPage;
    // @ts-ignore
    this.tableData = this.searchList.slice(currentLotStart, this.config.currentPage * this.config.itemsPerPage);

    $('.cdp').attr('actpage', paginationPage);
  }

  menuChange(fn: any): void {
    this.onChange = fn;
  }

  checkIfMount(val: { iData: any, iRow: any }): any {
    // item[r]?.libelle || item[r.libelle || r]
    // @ts-ignore
    const item = this.tableData[val.iData];
    // @ts-ignore
    const r = this.tableRow[val.iRow];
    const rLabel = (r.libelle || r) as string;
    // console.log(item, rLabel, r);
    // if((['mont', 'montant', 'montan', 'mtant', 'amount', 'sum'].indexOf(rLabel.toLocaleLowerCase())=== -1)) {
    // if (rLabel.toLocaleLowerCase().indexOf('montant') === -1) {
    return item[rLabel]?.libelle || item[rLabel];
    // }
    /**
     * Format value if sum
     */
    // console.error(this.tableData[val.iData][rLabel]);
    // return Utilities.montantFieldChange({
    //   $e: this.tableData[val.iData][rLabel],
    //   control: null,
    //   formG: null
    // });
  }

  getcolSpan(): any {
    // @ts-ignore
    return this.tableRow?.length + ((this.menus && this.menus.length > 0) ? 1 : 0) + (this.multiselectRow ? 1 : 0);
  }

  setIndex(i, item): TrackByFunction<any> {
    // console.log(item, 'iiiiii', i);
    if (item) {
      item._itemIndex = i;
      // this.tableFetchEndListener.emit({
      //   fetch: 'fetching', i, item, data: this.tableData
      // })
      //  if(this.tableData && this.tableData.length && i === this.tableData.length -1) {
      //    this.tableFetchEnd('end');
      //  }
    }
    // console.log(item);
    // @ts-ignore
    return;
  }

  formatHeader(i, item): TrackByFunction<any> {
    // if (item && !item.libelle) {
    item = {
      libelle: item.libelle || item,
      searchTarget: true
    };
    // } else {
    //   item.searchTarget = true;
    // }
    return item;
  }

  selected(ev, index, data): void {
    this._currentIndex = index;
    // console.log(data);
    this.rowClicked.emit(data);
  }

  checkBoxChange($event: Event, index): void {
    // this.critere[index].checked = ($event.target as any).checked;
    if (index !== -1) {
      this.searchCriterias[index].checked = ($event.target as any).checked;
      // item.searchTarget = ($event.target as any).checked
      this.checking = this.searchCriterias.filter((c) => c.checked);
      this.hasCriterias = this.checking !== null && this.checking.length > 0;
      this.allCheck = this.checking !== null && this.checking.length === this.searchCriterias.length;
      if (this.allCheck) {
        $('#all').attr('checked', 'true');
      }
      if (this.hasCriterias) {
        $('#all').attr('checked', null);
      }
    } else if (index === -1) {
      if (($event.target as any).checked) {
        for (let s of this.searchCriterias) {
          s.checked = false;
        }
      }
      return;
    }

    // console.log($event, this.searchCriterias, this.searchCriterias[index], this.hasCriterias, this.checking);
  }

  rowSelectChange($e, item, index): void {
    console.log('rowClicked', $e, item, index);
    console.error('checked', $e.target.checked);
    this.rowCheckedListener.emit({
      item: item,
      rowIndex: index,
      checked: $e.target.checked
    });
    this.allCheck = this.allChecked();
  }

  allChecked(): any {
    // console.log('allData', this.tableData, this.tableData.findIndex((data) => !data.isChecked));
    if (!this.tableData)
      return false;

    this.allCheck = this.tableData.findIndex((data) => !data.isChecked) === -1;
    // console.log('allChecked', this.allCheck);
  }

  tableFetchEnd($e): void {
    this.tableFetchEndListener.emit($e);
  }
}


