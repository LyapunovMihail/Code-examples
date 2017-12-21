import {Component, OnInit, Input, Output, EventEmitter, ViewChild} from '@angular/core';
import {FilterItem} from "./filterItem.component";
import * as _ from 'lodash';

@Component({
		selector: 'orgFilter',
		templateUrl: './orgFilter.component.html',
    //directives: [MATERIAL_DIRECTIVES, MdCheckbox, FilterItem],
    //providers: []
})

export class OrgFilter implements OnInit {

	@Input()
	root: any;

  @Output()
  change: EventEmitter<any> = new EventEmitter();

  @ViewChild('filter')
  filter: any;

  model: any = {};

  checked: boolean;

  debounceEnabledChanged: any;

	constructor() {
    this.debounceEnabledChanged = _.debounce(()=> {         
      if (this.checked && this.filter.checked) {
        this.change.emit(this.getModel());
      }
      else {
        this.change.emit(null);
      }
    }, 700);
  }

	ngOnInit() {
    this.root.onRefresh.subscribe(x => {
      this.enabledChanged(x);
    });
  }

  getModel() {
    return this.model;
  }

  enabledChanged(checked) {
    this.checked = checked;
    this.debounceEnabledChanged();
  }

  filterItemChanged(e){
    this.model[e.name] = e.values;
    this.change.emit(this.getModel());
  }
}
