import {Injectable}     from '@angular/core';
import {Http, Response} from '@angular/http';
import {httpHelper} from '../../../../../_services/http.ng2'
import {environment} from '../../environments/environment';

@Injectable()
export class OrgStatService {
    constructor(private http: Http) { }

    /*
    [{ org_id: 10, key: 'f', n : 35 }, ... ]
    */
    getOrgData(catId: string, orgId: number, filter: any): Promise<any> {
      const url = this.getUrl('/orgStat/getOrgData')
      return httpHelper.post(this.http, url, {orgId, catId, filter});
    }

    /*
    [{ id: 'f', title: 'Женщины' }, ... ]
    */
    getCatValues(catId: string, orgId: number): Promise<any> {
      const url = this.getUrl('/orgStat/getCatValues')
      return httpHelper.post(this.http, url, {orgId, catId});
    }

    getOrgDetails(orgId: number): Promise<any> {
      const url = this.getUrl('/orgStat/getOrgDetails/')
      return httpHelper.get(this.http, url + orgId);
    }

    getCurrentUser(): Promise<any> {
      const url = this.getUrl('/webapi/ctx/user')
      return httpHelper.get(this.http, url);
    }

    getSportsmens(orgId:number, nodeFilter: any, filter: any): Promise<any> {
      const url = this.getUrl('/orgStat/getSportsmens')
      return httpHelper.post(this.http, url, {orgId, nodeFilter, filter});
    }

    bulkUpdate(ids: any, field: string, value: string): Promise<any> {
      const url = this.getUrl('/orgStat/bulkUpdate')
      return httpHelper.post(this.http, url, {ids, field, value});
    }

    private getUrl(url: string) {
      console.log("apiHost+url: ", environment.apiHost + url)
      return environment.apiHost + url
    }
}
