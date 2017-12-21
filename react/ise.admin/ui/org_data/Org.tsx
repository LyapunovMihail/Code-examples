import {React, ReactComponent, If} from '../../refs'
import {List, ListItem} from 'material-ui/List'
import {OrgInfo} from "./OrgInfo"
import {OrgEdit} from "./OrgEdit"
import {orgSvc} from './OrgSvc'
import {toastr} from '../../../_shared/toastr'
import Paper from 'material-ui/Paper'
import FlatButton from 'material-ui/FlatButton'

const outerPaperStyle = {
  padding: '35px',
  marginBottom: '50px'
};

export class Org extends ReactComponent {

	orgId: number = this.props.orgId
	org: any
	showOrgEdit: boolean = false

	componentDidMount() {
    this.getOrg()
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.orgId !== nextProps.orgId) {
      this.props = nextProps
      this.showOrgEdit = false
      this.getOrg()
    }
  }

  getOrg() {
  	this.orgId = this.props.orgId
  	orgSvc.getOrgData(this.orgId).then(data => {
  		this.org = data
  		this.update()
  	}, err => {
  		toastr.err(err.responseJSON.errorMessage, "Ошибка")
  	}) 
  }

  refreshOrg(org) {
    this.org = org
  }

  switchView() {
    this.showOrgEdit = !this.showOrgEdit
    this.update()
  }

  render() {
    return (
	    <div>
				<Paper zDepth={3} rounded={false} className="col-xs-12" style={outerPaperStyle}>

		    	<If value={!this.showOrgEdit && this.org} content={() => {
            return (
              <OrgInfo org={_.clone(this.org)} switchView={this.switchView.bind(this)}/> 
            )
          }}>
          </If>

          <If value={this.showOrgEdit && this.org} content={() => {
            return (
              <OrgEdit org={_.clone(this.org)} switchView={this.switchView.bind(this)}
              refreshOrg={this.refreshOrg.bind(this)}/> 
            )
          }}>
          </If>

		 		</Paper>
	    </div>
	  );
  }
}