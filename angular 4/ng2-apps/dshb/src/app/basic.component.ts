import { Component, OnInit } from '@angular/core';
import {BasicService} from './basic.service';
import {UvrfService} from '../../../../_services/uvrfSvc';
import {BasicElementComponent} from './basicElement/basic.element.component';
import {MyChildrenComponent} from './myChildren/myChildren.component';
import * as _ from 'lodash';

@Component({
		selector: 'basic',
		templateUrl: './basic.component.html',
		styleUrls: ['./basic.component.less']
		//directives: [BasicElementComponent, MyChildrenComponent]
})

export class BasicComponent implements OnInit{
	constructor(private _basicService: BasicService,
							private _uvrfSvc: UvrfService) { }
	perms: any;
  data: any;
  uvrf: String;
  feedbackMessage: String;

  spm : any;
  isSpmParent: boolean = false;

  get isSpm(): boolean {
  	return !!this.spm;
  }

	ngOnInit() {
		this._basicService.getPermissions().then((perms) => {
			this.perms = perms;
		});

		this._basicService.getAuthorizedUserData().then((data) => {
			this.data = data;

			this.isSpmParent = !!_.find(data.roles, (x) => x == 'SPORTSMEN_PARENT');

			if (data && data.person && data.person.sportsmens[0]) {
				this.spm = data.person.sportsmens[0];
			}

			this._uvrfSvc.verified(this.data.email).then(verified => this.uvrf = verified);

			this.feedbackMessage = encodeURIComponent(
`
Добрый день. Прошу верифицировать мой аккаунт ${this.data.email}
Ссылка: ${window.location.origin}/account/${this.data.id}

[Здесь укажите ваши Ф.И.О., контактный номер телефона, город проживания или другую проверяемую
информацию, которая даст нам возможность проверить, что вы, на самом деле - это вы (например
контакты других людей, которые могут вас подтвердить; ссылки на профили в социальных сетях и т.п.).
Эта информация нужна только для проверки и доступна публично не будет.]

С уважением,
${this.data.name}
`
  		);
		});

	}
}
