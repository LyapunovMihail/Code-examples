import * as _ from 'lodash';

export class DataContainer {

	org: any;	
  childs = [];
  sum: number = 0;
  data: any = {};
 
	constructor(public root: any, public parent: DataContainer, public orgId: number){
		if (parent != null){
			parent.childs.push(this);
		}
		this.loadOrgDetails();
		const self = this;
		root.onCatChange.subscribe(x => {
			if (self.isLeaf){
				self.updateData();
			}     
    });
	}

	get level(){
    return this.parent ? (this.parent.level+1): 1;
  }

  get isOrgDetailsLoaded(): boolean{
  	return !!this.org;
  }

	loadOrgDetails(){
		if (this.isOrgDetailsLoaded) return;
		const self = this;
		self.getOrgDetails().then(data => {			
			self.org = data;
			_.each(data.childs, child => {
				const x = new DataContainer(self.root, self, child.id); 
				x.updateData();
			});
			self.updateData();
		});
	}

  get isLeaf(): boolean {
  	return !this.childs.length;
  }

  get isDataLoaded(): boolean {
  	return !!this.curData;
  }

  get curData(){
  	return this.isLeaf ? this.root.getDataValues(this.curCatId, this.orgId) : this.data[this.curCatId];
  }

  getValue(key: string){
  	const d = this.curData;
  	if (!d) return 0;
   	return d[key] || 0; 
  }

  updateParentData(){
  	if (this.parent){
  		this.parent.updateData();
  	}
  }
	
	get catValues(){
		return this.root.catValues;
	}

	updateSum(){		
		let s = 0;
		_.each(this.catValues, x => {
			s = s + this.getValue(x.id); 
		});
		this.sum = s;
		this.updateParentData(); 
	} 

  aggregateChildData(){
  	let d = {};
  	_.each(this.catValues, x => {    		  
  		 let s = 0;
  		_.each(this.childs, child => {
  			s = s + child.getValue(x.id);
  		});  			 
  		d[x.id] = s;
  	});

  	this.data[this.curCatId] = d;
  	this.updateSum(); 
  }

	updateData(){
		if (!this.isOrgDetailsLoaded) return;
	
		if (this.isLeaf){
			this.updateSum();
		} else {
			this.aggregateChildData();			
		}		
	}

	get curCat(){
		return this.root.curCat;
	}

	get curCatId(){
		return this.curCat.id;
	}

	getOrgDetails(): Promise<any>{
		return new Promise<any>((resolve, reject)=>{
			this.root.getOrgDetails(this.orgId).then((orgDetails) => {
				resolve(orgDetails);
			});
		});
	}

}