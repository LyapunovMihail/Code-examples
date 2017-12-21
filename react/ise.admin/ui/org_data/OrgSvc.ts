import {http} from "../../refs"
let $ = require("jquery");

export class OrgSvc {

	getOrgData(orgId: number) {
		return new Promise<any>((resolve, reject) => {
			http.get("/api/company/"+ orgId).then(response => {
				resolve(response)
			}, error => {reject(error)})
		});
	}

	createOrg(org: any) {
		return new Promise<any>((resolve, reject) => {
			http.post("/manager/createOrg", org).then(response => {
				resolve(response)
			}, error => {reject(error)})
		});
	}
	
	updateOrg(org: any) {
		return new Promise<any>((resolve, reject) => {
			http.post("/manager/updateOrg", org).then(response => {
				resolve(response)
			}, error => {reject(error)})
		});
	}
}

export const orgSvc = new OrgSvc();