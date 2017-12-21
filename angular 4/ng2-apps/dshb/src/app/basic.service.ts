
import {Injectable}     from '@angular/core';
import {Http, Response} from '@angular/http';
import {environment} from '../environments/environment';

@Injectable()
export class BasicService {
    constructor(private http: Http) { }

    private Url = '/dshb/permissions';  // URL to web api
   
    perms: any;
    data: any;

    getPermissions(): Promise<any> {
      if (this.perms){
        return Promise.resolve(this.perms);
      }
      return new Promise((resolve) => {
        const url = this.getUrl('/dshb/permissions')
        this.http.get(url)
          .map(res => res.json())
          .subscribe(perms => {
            this.perms = perms;  
            resolve(this.perms);   
          });
      });        
    }

    getAuthorizedUserData(): Promise<any> {
      if (this.data) {
        return Promise.resolve(this.data);
      }
      return new Promise((resolve) => {
        const url = this.getUrl('/webapi/ctx/user')
        this.http.get(url)
          .map(res => res.json())
          .subscribe(data => {
            this.data = data;
            resolve(this.data);
          });
      });
    }

    private getUrl(url: string) {
      console.log("apiHost+url: ", environment.apiHost + url)
      return environment.apiHost + url
    }
}