import { Component, OnInit, OnDestroy, Input, ViewContainerRef} from '@angular/core';
import * as _ from 'lodash';
import * as $ from 'jquery';
import * as moment from 'moment';
import {BasicService} from '../basic.service';
import {MyChildrenService} from './myChildren.service';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

@Component({
		selector: 'myChildren',
		templateUrl: './myChildren.component.html',
		styleUrls: ['./myChildren.component.less']
})

export class MyChildrenComponent implements OnInit, OnDestroy{
	
	data: any;
	parent: boolean;
	showChildEdit: boolean = true;
	childData = {
		surName: "Гаврилов",
		name: "Гаврила",
		patronymic: "Гаврилович",
		dateBirth: "",
		sex: "m"
	};
	sportsmenNum: any;
	children: any;
	child: any;
	orgKey: number;
	orgByKey: any;
	createChildResponse = {childData: {}, orgByKey: {}, person: {}, sportsmenNum: undefined};
	result: any;
	dateMin: string;
	dateMax: string;
	windowWidth: number = $(window).width();
	debounce: any;
	constructor(private _basicService: BasicService,
							private _myChildrenService: MyChildrenService,
							public toastr: ToastsManager, vcr: ViewContainerRef) {
		this.debounce = _.debounce(() => {
			this.windowWidth = $(window).width()
		}, 35);
		this.toastr.setRootViewContainerRef(vcr);
  }

  ngOnInit() {
		$(window).on("resize", () => {
			this.debounce();  
		});

		moment.locale("ru");

		this.dateMax = moment().subtract(3, 'years').calendar()
		this.dateMax = moment(this.dateMax, "DD.MM.YYYY").format("YYYY-MM-DD")

		this.dateMin = moment().subtract(18, 'years').calendar()
		this.dateMin = moment(this.dateMin, "DD.MM.YYYY").format("YYYY-MM-DD")

		this._basicService.getAuthorizedUserData().then((data) => {
			this.data = data;
			this.parent = !!_.find(this.data.roles, (x) => x == 'SPORTSMEN_PARENT'); 
		});

		this.getChildren();
  }

  ngOnDestroy() {
		$(window).off("resize");
  }

	getChildren() {
		this._myChildrenService.getChildren().then((children) => {
			this.children = children || [];
			this.showChildEdit = !this.children.length;
		});
	}

	findChild() {
		this.result = undefined;
		this.orgByKey = undefined;
		this.orgKey = undefined;
		this.sportsmenNum = undefined;
		var childAge = this.childAge();

		this._myChildrenService.findChild(this.childData).then((child) => {
			if (child.message) {
				this.result = child;
			}
			else if (childAge > 18 || childAge < 3) {
				this.result = {message: "Спортсмену должно быть от 3 до 18 лет"}
			}
			else	
				this.child = child;
		});
	}
	
	getOrgByKey(orgKey: string) {
		this._myChildrenService.getOrgByKey(orgKey).then((orgByKey) => {
			this.orgByKey = orgByKey;
		}, () => this.orgByKey = undefined);
	}

	createChild(requiredNum?: boolean) {
		if (requiredNum) {
			if (/^\d+$/.test(this.sportsmenNum) && this.sportsmenNum.length === 13)
				this.createChildResponse.sportsmenNum = this.sportsmenNum;
			else {
				this.result = {message: "Неправильный формат ID " + this.sportsmenNum}
				return
			}
		}

		this.createChildResponse.childData = this.childData
		this.createChildResponse.orgByKey = this.orgByKey
		this.createChildResponse.person = this.child
		this.createChildResponse.sportsmenNum = this.sportsmenNum
		this._myChildrenService.createChild(this.createChildResponse).then((createChildResult) => {
			this.result = createChildResult;
			this.child = undefined;
			this.orgByKey = undefined;
			this.sportsmenNum = undefined;
			this.getChildren();
			this.toastr.success("Спортсмен добавлен успешно", "Добавление спортсмена");
		}, (err) => {
			this.toastr.error("Спортсмен не добавлен : "+err.errorMessage, "Ошибка") 
		});
	}

	deleteChild(childId) {
		if (window.confirm("Вы действительно хотите удалить спортсмена?") == true) {
			this._myChildrenService.deleteChild(childId).then((deleteChildResult) => {
				this.result = deleteChildResult;
				this.child = undefined;
				this.orgByKey = undefined;
				this.sportsmenNum = undefined;
				this.getChildren();
			});
		}
	}

  /* Date methods */

	dateFormat(timeStamp, format) {
		var formatDate = moment(timeStamp, format).format('LL');
		formatDate = formatDate.replace(" г.", "г");
		return formatDate;
	}

	fromNow(timeStamp, format) {
		var formatDate = moment(timeStamp, format).fromNow();
		formatDate = formatDate.replace(" назад", "");
		return formatDate;
	}

	childAge() {
		var age = this.fromNow(this.childData.dateBirth, 'YYYY-MM-DD')
		age = age.replace(" лет", "")
		age = age.replace(" года", "")
		return +age;
	}

}
