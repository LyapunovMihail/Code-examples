import { Component, OnInit } from '@angular/core';
import {BasicElementComponent} from './basicElement/basic.element.component';
import {BasicService} from './basic.service';
import {basicElementData} from './basicElement/basic.elementData';
import {AcrStatisticComponent} from './acrStatistic/acrStatistic.component';

@Component({
		selector: 'report',
		templateUrl: './report.component.html',
		styleUrls: ['./dshbApp.routerComponent.less']
		//directives: [BasicElementComponent]
})

export class ReportComponent implements OnInit{
	constructor(private _basicService: BasicService) { }
	perms: any;
  data: any;
  elementData: any;

  ngOnInit() {
		this._basicService.getPermissions().then((perms) => {
			this.perms = perms;
			if (perms["acr_stats"])
				this.elementData = basicElementData["acr_stats"];
		});
	}
	
}