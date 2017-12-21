import * as React from 'react'
import {ReactComponent, http, If} from "./refs"
import {AuthContainer} from "../_shared/authContainer"
import {authSvc} from "../_services/authSvc"
import {AppMuiTheme} from '../_react/mui/theme'
import {mui} from './mui'
import {orgUsersSvc} from './OrgUsersSvc'
import "./app.scss"
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton'
import TextField from 'material-ui/TextField'
import {toastr} from '../_shared/toastr'

import {UserList} from './UserList'
import {UserInputs} from './UserInputs'
import {UserInfo} from './UserInfo'
import {orgSvc} from '../ise.admin/ui/org_data/OrgSvc'

let _ = require("lodash")

const User = (props) => {
  return (
    <div className="col-md-12">
      {props.children}
    </div>
  );
}

const outerPaperStyle = {
  paddingLeft: 0,
  marginBottom: '50px',
  display: 'inline-flex'
};

const innerPaperStyle = {
  paddingLeft:0,
  paddingRight:0
};

const buttonGroupStyle = {
  textAlign:"center", 
  padding: "15px", 
  marginBottom: "10px"
}

export class OrgUsers extends ReactComponent {

  orgId = this.props.orgId;
  org: any;
  showUserInputs = false;
  showUserInfo = true;
  users: any;
  newUser: any = {
    id: 0,
    email: "",
    passwordData: {password: "", emailDeliver: false},
    name: "",
    info: "",
    imageUrl: "",
    isAvatar: false,
    imageFileId: null,
    privateContacts: "",
    telegramUsername: "",
    startUrl: "",
    organizations: [],
    mainOrganization: {},
    adminNotes: "",
    isVerified: false,
    active: true,
    userRoles: {},
    allRoles: {}
  };
  user = this.newUser;
  selectedUser: any = {};
  actionWithUser: any = {action: "create"};
  selectedIndex = {setIndexToNull: false};
  authUser:any;

  resets() {
    this.user = null
    this.users = null
  }

  componentDidMount() {
    this.getAuthUser()
    this.getUsers()
    this.getAllRoles()
    this.getOrg()
    
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.orgId !== nextProps.orgId) {
      this.props = nextProps
      this.resets()
      this.getAuthUser()
      this.getUsers()
      this.getAllRoles()
      this.getOrg()
    }
  }

  getAuthUser() {
    this.authUser = authSvc.user
  }

  getAllRoles() {
    orgUsersSvc.getAllRoles().then(data => {
      this.newUser.allRoles = data.allRoles
    },err => {
      toastr.err(err.responseJSON.errorMessage, "Ошибка")
    })
  }

  getUsers(upd?: boolean) {
    this.orgId = this.props.orgId
    orgUsersSvc.getUsers(this.orgId).then(data => {
      this.users = data
      if (upd) {
        this.selectedIndex.setIndexToNull = true
      }
      this.update()
    },err => {
      toastr.err(err.responseJSON.errorMessage, "Ошибка")
    })
  }

  getOrg() {
    this.orgId = this.props.orgId
    orgSvc.getOrgData(this.orgId).then(data => {
      this.org = data
      this.newUser.mainOrganization.name = this.org.name
      this.newUser.mainOrganization.id = this.org.id
      this.newUser.mainOrganization.ind = 0
      this.newUser.organizations[0] = this.newUser.mainOrganization
      this.update()
    }, err => {
      toastr.err(err.responseJSON.errorMessage, "Ошибка")
    }) 
  }

  deleteUser() {
    if (window.confirm("Вы действительно хотите удалить пользователя?") === true) {
      orgUsersSvc.deleteUser(this.user).then(data => {
        toastr.ok(data.message)
        this.showUserInputs = false
        this.getUsers(true)   
      },err => {
        toastr.err("Пользователь не удален: " + err.responseJSON.errorMessage, "Ошибка")
      })
    }
  }

  createUser() {
    this.user = this.newUser
    this.actionWithUser.action = "create"
    this.showUserInputs = true 
    this.update()
  }

  editUser() {
    this.user = this.selectedUser  
    this.actionWithUser.action = "edit"

    _.map(this.user.allRoles, (r, ind) => {
      
      var role = _.find(this.user.userRoles, ur => { return ur == r.name });
      if (role) r.checked = true
    })

    this.update()
  }


  onUserSelected(user) {
    this.selectedUser = user;
    if (this.selectedUser) {
      this.showUserInputs = false
      this.editUser()
    }
    else
      this.createUser()
  }

  unselectUser() {
    this.selectedIndex.setIndexToNull = true
    this.update()
  }

  switchView(upd?: boolean) {
    this.showUserInputs = !this.showUserInputs
    if (upd === true) this.update()
  }

  setUserImageFileId(fileId: number, url: string, isAvatar: boolean) {
    this.user.imageFileId = fileId
    this.user.imageUrl = url
    this.user.isAvatar = isAvatar
    this.update()
  }

  render(){
    return (
      <AuthContainer>
        <AppMuiTheme>
          <div className="app-ise-usredt" >
            <Paper zDepth={3} rounded={false} className="col-xs-12" style={outerPaperStyle}>
               
              <If value={this.users} content={() => {
                return (
                  <Paper zDepth={1} rounded={false} className="col-xs-5" style={innerPaperStyle}>
                    <UserList users={this.users} onUserSelected={this.onUserSelected.bind(this)} 
                    selectedIndex={this.selectedIndex}/>
                    <div style={buttonGroupStyle}> 
                      <RaisedButton label="Удалить" secondary={true}
                      disabled={this.actionWithUser.action !== "edit"} style={{margin:"3px"}}
                      onClick={this.deleteUser.bind(this)}></RaisedButton>
                      <RaisedButton label="Добавить нового" primary={true} 
                        onClick={this.unselectUser.bind(this)}></RaisedButton>
                    </div>
                  </Paper>
                )
              }}>
              </If>
              
              <If value={this.users && this.showUserInputs} content={() => {
                return (
                  <div className="col-xs-7">
                    <UserInputs user={_.clone(this.user)} actionWithUser={this.actionWithUser}
                    getUsers={this.getUsers.bind(this)}
                    switchView={this.switchView.bind(this)} authUser={this.authUser}/> 
                  </div>
                )
              }}>
              </If>

              <If value={this.showUserInfo && this.users && !this.showUserInputs} content={() => {
                return (
                  <div className="col-xs-7">
                    <UserInfo user={_.clone(this.user)} switchView={this.switchView.bind(this)}
                    setUserImageFileId={this.setUserImageFileId.bind(this)}
                    actionWithUser={this.actionWithUser} authUser={this.authUser}/> 
                  </div>
                )
              }}>
              </If>

            </Paper>
          </div>
        </AppMuiTheme>
      </AuthContainer>
    )
  }

}
