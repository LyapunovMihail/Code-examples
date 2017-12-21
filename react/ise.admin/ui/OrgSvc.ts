import {http} from "../refs"
let $ = require("jquery");

export class OrgSvc {

	getRootOrgs() {
		return new Promise<any>((resolve, reject) => {
			http.get("/api/companies/root").then(response => {
				resolve(response)
			}, error => {reject(error)})
		});
	}

	getChildOrgs(id: number) {
		return new Promise<any>((resolve, reject) => {
			http.get("/api/companies/child/" + id).then(response => {
				resolve(response)
			}, error => {reject(error)})
		});
	}
}

export const orgSvc = new OrgSvc();