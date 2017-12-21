import {Component, OnInit, Input, EventEmitter, ViewChild, Inject} from '@angular/core';
import {OrgStatItem} from "./orgStatItem.component";
import {OrgFilter} from "./orgFilter.component";
import {OrgStatService} from './orgStat.service';
import {DataContainer} from './dataContainer';
import {MdDialog, MdDialogRef, MdDialogConfig, MD_DIALOG_DATA} from '@angular/material';

import * as _ from 'lodash';

@Component({
		selector: 'orgStat',
		templateUrl: './orgStat.component.html',
    styleUrls: ['./orgStat.component.less']
    //directives: [MdRadioButton, MdRadioGroup, MdCheckbox, OrgStatItem, FilterItem, OrgFilter, Charts, MATERIAL_DIRECTIVES],
    //providers: [MdRadioDispatcher, OrgStatService, OVERLAY_PROVIDERS]
})
export class OrgStatComponent implements OnInit {

  @Input()
  orgId: number;

  @ViewChild('spmPopup')
  spmPopup: any;

  @ViewChild('cfgDialog')
  cfgDialog: any;

	@ViewChild('dlgEditSelected')
  dlgEditSelected: any;

  spmPopupDialogRef: MdDialogRef<SpmPopupDialog>;
  editSelectedDialogRef: MdDialogRef<EditSelectedDialog>;

  self: OrgStatComponent;

  filter: any = {};

  onCatChange: EventEmitter<any> = new EventEmitter();
  onRefresh: EventEmitter<any> = new EventEmitter();
  debounceUpdateCatValues: any;

  cats = [
    { id: "sex", name: "Пол"},
    { id: "age", name: "Возраст"},
    { id: "year", name: "Год рождения"},
    { id: "tq", name: "Техническая кв."},
    { id: "sq", name: "Спортивная кв."},
    { id: "tr", name: "Первый тренер"},
    { id: "tr1", name: "Тренер 1 (Основной)"},
    { id: "tr2", name: "Тренер 2"},
    { id: "tr3", name: "Тренер 3"},
		{ id: "s_fed_okrug", name: "Фед. округ"},
		{ id: "s_region", name: "Регион"},
		{ id: "s_city", name: "Город"},
		{ id: "s_vedomstvo", name: "Ведомство"},
		{ id: "s_club", name: "Клуб"},
		{ id: "o", name: "Организация"}
  ];

  cfgs = {
    details: true,
    filter: true,
    percents: true,
    graphics: true
  }

  dialog: any = {n: '', data: []};
  feedbackMessage: string;

  defCat = this.cats[0];
  curCat = this.defCat;

  catValuesHolder: any = {};
  dataHolder: any = {};

  rootDataContainer : DataContainer;
	isModerator = false;

  updateModel: any = {};

  config: MdDialogConfig = {
    disableClose: false,
    width: '',
    height: '',
    position: {
      top: '',
      bottom: '',
      left: '',
      right: ''
    },
    data: {
      cfgs: this.cfgs,
      onRefresh: this.onRefresh,

      dialog: this.dialog,
      feedbackMessage: this.feedbackMessage,
      updateModel: this.updateModel,
      isModerator: this.isModerator,
      showEditSelected: this.showEditSelected,

      onValChange: this.onValChange,
      editSelected: this.editSelected
    }
  };

  constructor(private _orgStatService: OrgStatService,
              public mDialog: MdDialog) {
    this.self = this;

    this.debounceUpdateCatValues = _.debounce(()=> {
      this.loadCatValues(this.curCat.id, this.orgId).then(()=> {
        this.loadData(this.curCat.id, this.orgId).then(() => {
          this.onCatChange.emit(this.curCat);
        });
      })
    }, 700);

		_orgStatService.getCurrentUser().then(x => {
			this.isModerator = x.isModerator; 
		});
  }

	ngOnInit() {
    this.updateCatValues();
    this.rootDataContainer = new DataContainer(this, null, this.orgId);
    this.rootDataContainer.updateData();
  }

  updateCatValues(cat?: any){
    this.curCat = cat || this.defCat;
    this.debounceUpdateCatValues();
  }

  private loadData(catId: string, parentOrgId: number): Promise<any> {
    return new Promise<any>((resolve, reject)=>{
      const loaded = this.dataHolder[catId];
      if (loaded) {
        resolve();
      } else {
        this._orgStatService.getOrgData(catId, parentOrgId, this.filter).then(data => {
          data.forEach(x => {

            const key = catId + "_" + x.org_id;
            const d = this.dataHolder[key] || {};
            d[x.id] = x.n;
            this.dataHolder[key] = d;

          });
          this.dataHolder[catId] = true;
          resolve();
        });
      }
    })
  }

  reloadData(){
    this.dataHolder = {};
    this.updateCatValues(this.curCat);
  }

  loadCatValues(catId: string, parentOrgId: number): Promise<any> {
    return new Promise<any>((resolve, reject)=>{
      const d = this.catValuesHolder[catId];
      if (d) {
        resolve(d);
      } else {
        this._orgStatService.getCatValues(catId, parentOrgId).then(data => {
          this.catValuesHolder[catId] = data;
          resolve(data);
        });
      }
    })
  }

  get catValues(){
    const val = this.catValuesHolder[this.curCat.id]|| [];
    return val;
  }

  getOrgDetails(orgId: number){
    return new Promise<any>((resolve, reject)=>{
      this._orgStatService.getOrgDetails(orgId).then((orgDetails) => {
        resolve(orgDetails);
      });
    })
  }

  getDataValues(catId: string, orgId: number) {
    const key = catId + "_" + orgId;
    const d = this.dataHolder[key];
    return d;
  }

  onFilter(e) {
    this.filter = e;
    this.reloadData();
  }

  showSpm(orgId, catId, catValueId, n, catValueTitle) {

		this.updateModel.busy = false;
		this.updateModel.field = this.updateFieldsMap[catId] || "";
		this.updateModel.value = catValueTitle || "";

    this.dialog.n = n;
    const nodeFilter = { orgId, catId, catValueId: catValueId || '*' };
    if (n <= 500) {
      this._orgStatService.getSportsmens(orgId, nodeFilter, this.filter).then((data) => {
        this.dialog.data = data;
        data = _.map(data, x => {
          return x.id
        });
				this.updateModel.ids = data;
        this.feedbackMessage = encodeURIComponent(data);
        //this.spmPopup.show();
        let dialogRef = this.mDialog.open(SpmPopupDialog, this.config);
      });
    }
    else {
      let dialogRef = this.mDialog.open(SpmPopupDialog, this.config);
    }
  }

	showEditSelected(){
		//this.spmPopup.close(true);
    this.spmPopupDialogRef.close();
		//this.dlgEditSelected.show();
    let dialogRef = this.mDialog.open(EditSelectedDialog, this.config);
	}

	

	updateFieldsMap = {
		"s_fed_okrug": "fed_okrug",
		"s_region": "region",
		"s_city": "city",
		"s_vedomstvo": "vedomstvo",
		"s_club": "club",
		"tr": "trainer",
		"tr1": "trainer1",
		"tr2": "trainer2",
		"tr3": "trainer3"
	}

	onFieldChange(e){
		this.updateModel.field = e.target.value;
	}

	onValChange(e){
		this.updateModel.value = e.target.value;
	}

	editSelected(){
		if (this.updateModel.field && !this.updateModel.busy){
			this.updateModel.busy = true;
			this._orgStatService.bulkUpdate(this.updateModel.ids, this.updateModel.field, this.updateModel.value).then((x)=>{
				//this.dlgEditSelected.close(true);
        //this.editSelectedDialogRef.close();
			});
		} else {
			//this.dlgEditSelected.close(true);
      //this.editSelectedDialogRef.close();
		}
	}

  refreshData() {
    this.dialog = {n: '', data: []};

    this.catValuesHolder = {};

    this.reloadData();

    this.onRefresh.emit(this.cfgs.filter);
  }


  openCfgDialog() {
    let dialogRef = this.mDialog.open(CfgDialog, this.config);
    console.log("ACCESS")
  }

}


@Component({
  selector: 'cfg-dialog',
  template: `
    <div fxLayout="column" fxLayoutAlign="center start" style="margin-left: 20px">
      <md-checkbox class="md-primary" [ngModel]="data.cfgs.details" (change)="data.cfgs.details = !data.cfgs.details">Детализация данных по организациям</md-checkbox>
      <md-checkbox [ngModel]="data.cfgs.filter" (change)="data.cfgs.filter = !data.cfgs.filter; data.onRefresh.emit(data.cfgs.filter)">Фильтр</md-checkbox>
      <md-checkbox [ngModel]="data.cfgs.percents" (change)="data.cfgs.percents = !data.cfgs.percents">Проценты</md-checkbox>
      <md-checkbox [ngModel]="data.cfgs.graphics" (change)="data.cfgs.graphics = !data.cfgs.graphics">Графики</md-checkbox>
    </div>

    <md-dialog-actions>
      <span flex></span>
      <button md-button class="md-primary" (click)="dialogRef.close()">
        <span>Закрыть</span>
      </button>
    </md-dialog-actions>`
})
export class CfgDialog {

  constructor(
    public dialogRef: MdDialogRef<CfgDialog>,
    @Inject(MD_DIALOG_DATA) public data: any) { }
}


@Component({
  selector: 'spmPopup-dialog',
  template: `
    <form style="overflow-y: auto; max-height: 500px">
      <br>
      <div *ngIf="data.dialog.n > 500">
        <p align="left">Список из {{data.dialog.n}} чел. слишком большой
         <br>
         (Максимальное значение 500 чел.)</p>
      </div>

      <div *ngIf="data.dialog.n <= 500">
        <div *ngIf="!data.dialog.data.length" style="margin-top: 40px" align="center">
          <p style="font-size: 2em"><i class="fa fa-spinner fa-pulse fa-3x fa-fw"></i></p>
            <br>
          <p><span style="font-size: 3em">&nbsp;&nbsp;Загрузка...</span></p>
        </div>

        <ol>
          <li *ngFor="let spm of data.dialog.data"><a href="/sportsmen/{{spm.id}}" target="_blank">{{spm.name}}</a></li>
        </ol>
      </div>
    </form>

    <md-dialog-actions>
      <a  style="margin-bottom: 15px" md-button href="/orgStat/export/csv?ids={{data.feedbackMessage}}" target="_blank">
        <span>Скачать...</span>
      </a>
      <span flex></span> 
      <button *ngIf="!!data.updateModel.field && data.isModerator" md-button style="margin-bottom: 15px" (click)="data.showEditSelected()">
        <span>Редактировать</span>
      </button>
      <button md-button class="md-primary" style="margin-bottom: 15px" (click)="dialogRef.close()">
        <span>Закрыть</span>
      </button>
    </md-dialog-actions>`
})
export class SpmPopupDialog {

  constructor(
    public dialogRef: MdDialogRef<SpmPopupDialog>,
    @Inject(MD_DIALOG_DATA) public data: any) { }
}


@Component({
  selector: 'editSelected-dialog',
  template: `
    <div layout="column" layout-align="center start" style="margin-left: 20px">
      <label>Новое значение</label>
      <input class="form-control" [value]="data.updateModel.value" style="width:100%" type="text" (change)="data.onValChange($event)" />
    </div>

    <md-dialog-actions>
      <span flex></span>
      <button [disabled]="data.updateModel.busy" md-button class="md-primary" (click)="data.editSelected()">
        <span>ОК</span>
      </button>
      <button md-button (click)="dialogRef.close()">
        <span>Отмена</span>
      </button>
    </md-dialog-actions>`
})
export class EditSelectedDialog {

  constructor(
    public dialogRef: MdDialogRef<CfgDialog>,
    @Inject(MD_DIALOG_DATA) public data: any) { }
}