import {http} from "./refs"
let $ = require("jquery");

export class OrgMgrSvc {
	getOrgs(userId: number) {
		return new Promise<any>((resolve, reject) => {
			http.get("/manager/getOrgs/"+ userId).then(response => {
				resolve(response)
			}, error => {reject(error)})
		});
	}
}

export const orgMgrSvc = new OrgMgrSvc();