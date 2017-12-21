import * as React from 'react'
import {ReactComponent, http, Visible} from "./refs"
import {AuthContainer} from "../_shared/authContainer"
import {authSvc} from "../_services/authSvc"
import {AppMuiTheme} from '../_react/mui/theme'
import {AppBarView} from "./AppBarView"
import {mui} from './mui'
import {orgMgrSvc} from './OrgMgrSvc'
import {OrgList} from './OrgList'
import "./app.scss"; 

let _ = require("lodash")


export class OrgMgrApp extends ReactComponent {

componentDidMount() {
  authSvc.then(u => {
    orgMgrSvc.getOrgs(u.id).then(data => {
      this.data = data;
      this.update();
    }, error => {console.log("error", error)})
  })
}

data: any;

render(){

  var lists = _.map(this.data, (x) => <OrgList key={x.id} text={x.name} item={x}/>);

  return (
    <AuthContainer>
      <AppMuiTheme>
        <div className="app-ise-orgmgr">
          <AppBarView />
          <Visible value={http.isActive}>  
              <mui.LinearProgress mode="indeterminate" style={{backgroundColor: "#E3F2FD"}}/>
          </Visible>
          <div className="container-fluid">
            <div className="col-md-12">
              {lists}
            </div>
          </div>
        </div>
      </AppMuiTheme>
    </AuthContainer>
  )
}

}
