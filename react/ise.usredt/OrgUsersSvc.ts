import {http} from "./refs"
let $ = require("jquery");

export class OrgUsersSvc {
	getUsers(orgId: number) {
		return new Promise<any>((resolve, reject) => {
			http.get("/manager/getUsers/"+ orgId).then(response => {
				resolve(response)
			}, error => {reject(error)})
		});
	}

	getAllRoles() {
		return new Promise<any>((resolve, reject) => {
			http.get("/manager/getAllRoles").then(response => {
				resolve(response)
			}, error => {reject(error)})
		});
	}

	createUser(user: any) {
		return new Promise<any>((resolve, reject) => {
			http.post("/manager/createUser", user).then(response => {
				resolve(response)
			}, error => {reject(error)})
		});
	}

	updateUser(user: any) {
		return new Promise<any>((resolve, reject) => {
			http.post("/manager/updateUser", user).then(response => {
				resolve(response)
			}, error => {reject(error)})
		});
	}

	deleteUser(user: any) {
		return new Promise<any>((resolve, reject) => {
			http.post("/manager/deleteUser", user).then(response => {
				resolve(response)
			}, error => {reject(error)})
		});
	}

	setUserAvatar(userId: number, fileId: number) {
		return new Promise<any>((resolve, reject) => {
			http.get("/api/user/"+userId+"/avatar/"+fileId).then(response => {
				resolve(response)
			}, error => {reject(error)})
		});
	}

	editPassword(user: any) {
		return new Promise<any>((resolve, reject) => {
			http.post("/manager/editPassword", user).then(response => {
				resolve(response)
			}, error => {reject(error)})
		});
	}
}

export const orgUsersSvc = new OrgUsersSvc();