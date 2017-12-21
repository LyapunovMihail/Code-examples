import {Injectable}     from '@angular/core';
import {Http, Headers, Response} from '@angular/http';
import {httpHelper} from '../../../../../_services/http.ng2'
import {environment} from '../../environments/environment';

@Injectable()
export class MyChildrenService {
    constructor(private http: Http) { }

    private Url = '/dshb/permissions';  // URL to web api

    children: any;
    child: any;
    orgByKey: any;
    createChildResult: any;
    deleteChildResult: any;

    getChildren(): Promise<any> {
      return new Promise((resolve) => {
        const url = this.getUrl('/dshb/getChildren')
        this.http.get(url)
          .map(res => res.json())
          .subscribe(children => {
            this.children = children;
            resolve(this.children);
          });
      });
    }

    findChild(childData: any): Promise<any> {
      return new Promise((resolve, reject) => {
        const url = this.getUrl('/dshb/findChild')
        httpHelper.post(this.http, url, childData).then( response =>{
          this.createChildResult = response;
          resolve(response); 
        }, reject) 
      });
    }

    getOrgByKey(inviteKey): Promise<any> {
      return new Promise((resolve, reject) => {
        const url = this.getUrl('/dshb/getOrgByKey/')
        if (inviteKey) {
          this.http.get(url + inviteKey)
            .map(res => res.json())
            .subscribe(orgByKey => {
              this.orgByKey = orgByKey;
              resolve(this.orgByKey);
            });
        } else {
          reject();
        }
        
      });
    }

    createChild(data): Promise<any> {
      return new Promise((resolve, reject) => {
        const url = this.getUrl('/dshb/createChild')
        httpHelper.post(this.http, url, data).then( response =>{
          this.createChildResult = response;
          resolve(response); 
        }, reject)        
      });
    }

    deleteChild(childId) : Promise<any> {
      return new Promise((resolve) => {
        const url = this.getUrl('/dshb/deleteChild/')
        this.http.get(url + childId)
          .map(res => res.json())
          .subscribe(deleteChildResult => {
            this.deleteChildResult = deleteChildResult;
            resolve(this.deleteChildResult);
          });
      });
    }

    private getUrl(url: string) {
      console.log("apiHost+url: ", environment.apiHost + url)
      return environment.apiHost + url
    }
}
