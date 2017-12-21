import { Component, OnInit, ViewContainerRef} from '@angular/core';
import * as moment from 'moment';
import * as _ from 'lodash';
import './orgdup.component.less';
import {OrgdupService} from './orgdup.service';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

@Component({
    selector: 'org-duplicate',
    templateUrl: './orgdup.component.html'
})

export class OrgDuplicateComponent implements OnInit {
  constructor(private _orgdupService: OrgdupService,
    public toastr: ToastsManager, vcr: ViewContainerRef) {
    this.toastr.setRootViewContainerRef(vcr) }

  loading: boolean = false;
  results: any;

  main: any = {};
  dups: any = {};
  mainMas: any = [];
  dupsMas: any = [];
  orgName: string = "";
  //paging vars
  startPage: any;
  lastPage: any;
  currentPage: any;
  pageCapacity = 20;

  ngOnInit() {
    this.getOrgs();
  }
  
  getOrgs() {
    this.loading = true;
    this.results = undefined;
    this._orgdupService.getOrgs(this.mainMas, this.dupsMas, this.orgName).then(results => {
      console.log("results: ", results)
      this.setFieldsAfterHttpReq(results)
      this.loading = false;
    }, err => {
      this.toastr.error(err.errorMessage, "Ошибка");
      console.log("Ошибка: ", err)
      this.loading = false;
    })
  }

  setFieldsAfterHttpReq(results) {
    this.results = results;
    this.startPage = 1;
    this.currentPage = 1;
    this.lastPage = Math.ceil(results.data.length/this.pageCapacity);
  }

  uniteOrgs() {
    const mainOrg = this.mainMas.pop();
    this._orgdupService.uniteOrgs(mainOrg, this.dupsMas).then(results => {
      this.dupsMas = [];
      this.main = {};
      this.dups = {};
      this.getOrgs();
      this.toastr.success("Организации успешно объединены", "Объединение организаций");
    }, err => {
      this.dupsMas = [];
      this.main = {};
      this.dups = {};
      this.getOrgs();
      this.toastr.error("Организации не объединены: " + err.errorMessage, "Ошибка");
    })
  }

  //exchange orgs methods

  allToMain(org: any) {
    this.main[org.id] = org;
    this.mainMas = _.values(this.main);
    this.setDisplayOrgs(org, true);
  }  

  mainToAll(org: any) {
    delete this.main[org.id];
    this.mainMas = _.values(this.main);
    this.setDisplayOrgs(org, false);
  }

  private setDisplayOrgs(org, display) {
    this.results.data.map(x => {
      if (x.org.id === org.id) x.org.noDisplay = display;
      x.items.map(x => {
        if (x.id === org.id) x.noDisplay = display;
        return x;
      });
      return x;
    });
  }

  mainToDups(org: any) {
    delete this.main[org.id];
    this.mainMas = _.values(this.main);
    this.dups[org.id] = org;
    this.dupsMas = _.values(this.dups);
  }

  dupsToMain(org: any) {
    delete this.dups[org.id];
    this.dupsMas = _.values(this.dups);
    this.main[org.id] = org;
    this.mainMas = _.values(this.main);
  }

  //paging methods

  toFirstPage() {
    this.startPage = 1;
    this.currentPage = this.startPage;
  }

  prevPages() {
    this.startPage = this.startPage != 1 ? this.startPage-10 : this.startPage;
    this.currentPage = this.startPage;
  }

  nextPages() {
    this.currentPage = this.lastPage >= this.startPage+10 ? this.startPage+10 : this.lastPage;
    this.startPage = this.lastPage >= this.startPage+10 ? this.startPage+10 : this.startPage;
  }

  toLastPage() {
    this.startPage = this.lastPage%10 !== 0 ? this.lastPage+1 - this.lastPage%10 : this.lastPage-9;
    this.currentPage = this.lastPage;
  }

  setPage(page) {
    this.currentPage = page;
  }

  public get pageOrgs() {
    const offset = (this.currentPage-1)*this.pageCapacity;
    const maxOrg = this.results.data.length < offset + this.pageCapacity ?
    this.results.data.length : offset + this.pageCapacity;
    const pageOrgs = this.results.data.slice(offset,maxOrg)
    console.log("pageOrgs: ", pageOrgs)
    return pageOrgs
  }
}
