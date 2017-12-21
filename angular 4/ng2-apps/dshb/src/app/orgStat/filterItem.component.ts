import {Component, OnInit, Input, Output, EventEmitter, ViewChild} from '@angular/core';
import * as _ from 'lodash';

@Component({
		selector: 'filterItem',
		templateUrl: './filterItem.component.html'
    //directives: [MATERIAL_DIRECTIVES, MdCheckbox],
    //providers: []
})

export class FilterItem implements OnInit {

	@Input()
	root: any;
	
	@Input()
	cat: any;

	@Output()
  change: EventEmitter<any> = new EventEmitter();

  @ViewChild('switch')
  switch: any;
	
	model : any = {
		enabled : false,
		data: {}
	};

  debounceEmit: any;
  debounceOnEnabled: any;

	constructor() {
    this.debounceEmit = _.debounce(() => {               
      this.emitChange();
    }, 700);

    this.debounceOnEnabled = _.debounce(() => {               
      if (!this.model.enabled){
        this.emitChange();
      } 
      else {
        this.root.loadCatValues(this.cat.id, this.root.orgId).then(() => {
          this.emitChange();
        })
      }
    }, 700);

  }

  emitChange(){
     this.change.emit(this.getModel()); 
  }

	ngOnInit() {  
		/*this.root.onRefresh.subscribe(x => {
			console.log("this.switch.checked", this.switch.checked)
			console.log("this.model.enabled", this.model.enabled)
			if (this.model.enabled)
				this.switch.checked = this.model.enabled
    });*/
    
  }
  
  get catValues(){
  	return this.root.catValuesHolder[this.cat.id];
  }

  getModel(){
  	const vals = [];
  	if (this.model.enabled){
  		_.each(this.model.data, (value, key) => {
  			if (value) vals.push(key+"");
  		});
  	}
  	return {
  		name: this.cat.id,
  		values : vals 
  	}
  }

  onEnabled() {
    this.model.enabled = !this.model.enabled; 
    this.debounceOnEnabled();
  }

  onValueChange(value, event) {
    this.model.data[value.id] = event.checked;
    this.debounceEmit();
  }

}
