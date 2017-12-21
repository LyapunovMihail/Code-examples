import {Injectable}     from '@angular/core';
import {Http, Response} from '@angular/http';
//import {httpHelper} from '../../../../_services/http.ng2';
import 'rxjs/add/operator/toPromise';
import {environment} from '../environments/environment';

@Injectable()
export class OrgdupService {
    constructor(private http: Http) { }

    orgs: any;

    getOrgs(mainMas, dupsMas, orgName): Promise<any> {
    	console.log("orgName: ", orgName)
    	const url = this.getUrl('/admin/orgdup/getOrgs')
      return this.http.post(url, 
      	JSON.stringify({mainMas, dupsMas, orgName}))
      	.toPromise()
      	.then(response => response.json())
      	.catch(this.handleError);
    }
    uniteOrgs(mainOrg, dupsMas): Promise<any> {
    	const url = this.getUrl('/api/companies/unite')
      return this.http.post(url, 
      	JSON.stringify({mainOrg, dupsMas}))
      	.toPromise()
      	.then(response => response.json())
      	.catch(this.handleError)
    }

    private handleError(error: any): Promise<any> {
	    console.error('An error occurred', error);
	    return Promise.reject(error.body || error);
	  }

	  private getUrl(url: string) {
	  	console.log("apiHost+url: ", environment.apiHost + url)
	  	return environment.apiHost + url
	  }

}