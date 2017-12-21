import {React} from '../refs'
import {TreeView, culcTotalChildrenCount} from '../../_ui/TreeView'
let _ = require("lodash")

let adapter = {

  getOtions: () => {
      return {
        header: true
      }
  },

  getColumnDefs: () => {
      return [
        { id: "count", title: "Кол-во", getData: (node) => { return culcTotalChildrenCount(node) }},
        { id: "users", title: "Users"}
      ]
  },

  getColumnData: (node, column, sender) => {
    return column.getData ? column.getData(node) : 0;
  },

  isLeafNode: (node) => {
    return node.level >= 4;
  },

  getNodes: (node, opts) => {
   return new Promise((resolve)=> {
     if (node.level > 4) {
       resolve([]);
     } else {
       setTimeout(() => {
         let nums = _.range(1, 5);
         let r = _.map(nums, x => { return { name: `Node ${node.level+1}.${x}`, id: x} });
         resolve({
           total: 100,
           items : r
         });
       }, 0);

     }
   });
 },

 onSelectNode: (node, sender) => {
   console.log("onSelectNode", node);
   if (node.level === 2){
     node.loadAll().then(()=>{
       sender.update();
     })
   }
 }

}

export const Orgs = (props) => {
  return (<div>
    <h1>Организации</h1>
    <TreeView adapter={adapter}/>
    </div>)
}
