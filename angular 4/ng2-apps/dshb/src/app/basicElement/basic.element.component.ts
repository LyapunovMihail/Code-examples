import { Component, OnInit, Input } from '@angular/core';
import { BasicService } from '../basic.service';
import {basicElementData} from './basic.elementData';
import {ScrService} from '../../../../../_services/scrSvc';
import {UvrfService} from '../../../../../_services/uvrfSvc';

@Component({
		selector: 'basic-element',
		templateUrl: './basic.element.component.html',
		styleUrls: ['./basic.element.component.less']
})

export class BasicElementComponent implements OnInit{

  @Input()
	name: string;
	
	@Input()
	href: string;

  @Input()
	visible: boolean;

	constructor(private _basicService: BasicService,
							private _scrSvc: ScrService,
							private _uvrfSvc: UvrfService) {

  }

  elementData: any;
  data: any;
  scr: Number;
  uvrf: Number;

  get url(): string {
  	return this.href || this.elementData.href;
  }

	ngOnInit() {

		this._basicService.getPermissions().then((perms) => {
		
			if (this.name.indexOf("admin") !== -1)
				this.elementData = basicElementData[this.name];
			else if (perms[this.name] || (this.visible && basicElementData[this.name]))
				this.elementData = basicElementData[this.name];
		});

		this._basicService.getAuthorizedUserData().then((data) => {
			this.data = data;
		});    

		if (this.name === 'admin.scr')
			this._scrSvc.count().then(n => this.scr = n);

		if (this.name === 'admin.uvrf')
			this._uvrfSvc.count().then(n => this.uvrf = n);
  }
}

