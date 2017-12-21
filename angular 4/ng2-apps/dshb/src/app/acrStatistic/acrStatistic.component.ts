import { Component, OnInit, ViewChild } from '@angular/core';
import {AcrService} from '../../../../../_services/acrSvc';
import * as moment from 'moment';
import * as _ from 'lodash';

@Component({
		selector: 'acrStatistic',
		templateUrl: './acrStatistic.component.html',
    styleUrls: ['./acrStatistic.component.less']
    //directives: [NgClass, FORM_DIRECTIVES, MATERIAL_DIRECTIVES]
})

export class AcrStatisticComponent implements OnInit {
	constructor(private _acrSvc: AcrService) { }
  search: String;
  acr: any;
  org: String;
  orgs: any;
  user: String;
  users: any;
  date: String;
  dates: any;
  dateFrom: String;
  dateTo: String;
  page: number;
  startPage: number;
  lastPage: number;
  label: String;

  ngOnInit() {
    this.page = 1;
    this.startPage = 1;
    this._acrSvc.getOrgs().then(orgs => {
        this.orgs = orgs;
        /*this.events = _.clone(this.audit);
        this.events = _.pluck(this.events, 'event');
        this.events = _.uniq(this.events);
        this.event = "";*/
        this.org = "";
      });
    this._acrSvc.getUsers().then(users => {
        this.users = users;
        this.user = "";
      });
    this._acrSvc.getDates().then(dates => {
      this.dates = dates;
      this.date = "";
    });
    this.getAcr();
  }

  onOrgChange() {
    window.setTimeout(() => { this.getAcr() }, 0);
  }

  onUserChange() {
    window.setTimeout(() => { this.getAcr() }, 0);
  }

  onDateChange() {
    window.setTimeout(() => {
      if (this.date == "") {
        this.dateFrom = "";
        this.dateTo = "";
      }
      else {
        this.dateFrom = this.date.split(" ")[0];
        this.dateTo = this.date.split(" ")[1];
      }
      this.getAcr() 
    }, 0);
  }
  
  onDateFromChange() {
    window.setTimeout(() => {
      if (this.dateFrom == "" || this.dateTo == "")
        this.date = "";
      else
        this.date = this.dateFrom + " " + this.dateTo;
      this.getAcr() 
    }, 0);
  }

  onDateToChange() {
    window.setTimeout(() => {
      if (this.dateTo == "" || this.dateFrom == "")
        this.date = "";
      else
        this.date = this.dateFrom + " " + this.dateTo;
      this.getAcr() 
    }, 0);
  }

  getAcr() {
    let model: any = {};
    model.search= this.search;
    model.org=this.org;
    model.user = this.user;
    model.dateFrom = this.dateFrom;
    model.dateTo = this.dateTo;

    model.page=this.page;
    model.limit= 7;
    model = JSON.stringify(model);
    this._acrSvc.getAcrCollection(model).then(acr => {
      this.acr = acr;
      /*this.audit = _.map(_.range(273), function(x) {
        return {
          message: "Сообщение " + x,
          event: "Событие " + x%10,
          ct_time: new Date()
        };
      }); */
      console.log("this.acr: ", this.acr)
      this.acr.count % 7 == 0 ? this.lastPage = (this.acr.count / 7) | 0 
        : this.lastPage = ((this.acr.count / 7) | 0) + 1;
    });
  }

  dateFormat(timeStamp) {
    var formatDate = moment(timeStamp).format("DD.MM.YY  H:mm");
    return formatDate;
  }

  fromNow(timeStamp) {
    var formatDate = moment(timeStamp).fromNow();
    return formatDate;
  }

  prevPages() {
    if (this.startPage != 1)
      this.startPage -= 10;
      this.page = this.startPage;
      this.getAcr()
  }

  nextPages() {
    if (this.lastPage > this.startPage + 10) {
      this.startPage += 10;
      this.page = this.startPage;
    }
    else
      this.page = this.lastPage;
    this.getAcr()
  }

  toFirstPage() {
    this.page = 1;
    this.startPage = 1;
    this.getAcr()
  }

  toLastPage() {
    this.page = this.lastPage; 
    this.lastPage %10 == 0 ? this.startPage = (((this.lastPage / 10)|0) *10)-9
      : this.startPage = (((this.lastPage / 10) | 0) * 10) + 1;
    this.getAcr()
  }

  setPage(page) {
    this.page = page;
    this.getAcr()
  }

  labelPo() {
    this.label = 'По'
  }

  labelDash() {
    this.label = '--'
  }
}