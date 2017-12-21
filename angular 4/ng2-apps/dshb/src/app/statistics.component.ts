import {Component, OnInit} from '@angular/core';
import {OrgStatComponent} from './orgStat/orgStat.component';
import { BasicService } from './basic.service';

@Component({
		selector: 'statistics',
		templateUrl: './statistics.component.html'
    //directives: [OrgStatComponent]
})

export class StatisticsComponent implements OnInit {

  constructor(private _basicService: BasicService) {}

  user: any;
  ext: any = { x: 42 };

  orgId: number;

	ngOnInit() {
    this._basicService.getAuthorizedUserData().then((data) => {
      this.user = data;
      //console.log("USER", data)
    });
  };

}
