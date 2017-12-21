import {Component, OnInit, Input, Injectable} from '@angular/core';
import {OrgStatService} from './orgStat.service';
import {DataContainer} from './dataContainer';
import {FilterPercents} from './filterChilds.pipe';
import {Charts} from './charts.component';
import * as _ from 'lodash'; 

@Component({
		selector: 'orgStatItem',
		templateUrl: './orgStatItem.component.html',
    styleUrls: ['./orgStatItem.component.less']
    //directives: [Charts, MdRadioButton, MdRadioGroup, MdCheckbox, OrgStatItem, MdIcon, NgStyle, MATERIAL_DIRECTIVES],
    //providers: [MdRadioDispatcher, OrgStatService, OVERLAY_PROVIDERS],
})

export class OrgStatItem implements OnInit {

  @Input()
  dc: DataContainer;

  @Input()
  root: any;

  @Input()
  parent: OrgStatItem;

  @Input()
  index: number;

  show: boolean;

  self: OrgStatItem;

  details: boolean = true;

  graphic: boolean = false;

  constructor(private _orgStatService: OrgStatService) {
    this.self = this;
  }

  get ind() {
    return (this.index || 0) + 1;
  }

  get level(){
    return this.dc.level;
  }

  get orgId(): number {
    return this.dc.orgId;
  }

  percent(value): number {
    return Math.round((value * 100) / this.dc.sum)
  }

 	ngOnInit() {

  }

  get catValues(){
    return _.filter(this.root.catValues, x => !!this.dc.getValue(x.id)) ;
  }

  showSpm(orgId, catId, catValueId, n, catValueTitle) {
    this.root.showSpm(orgId, catId, catValueId, n, catValueTitle);
  }

}
