import {React, ReactComponent, If} from '../refs'
import {OrgUsers} from "../../ise.usredt/OrgUsers"
import {Org} from "./org_data/Org"
import {TreeView, culcTotalChildrenCount} from '../../_ui/TreeView'
import {OrgTreeView} from '../../_ui/OrgTreeView'
import {orgSvc} from './org_data/OrgSvc'
import {Tabs, Tab} from 'material-ui/Tabs'
import RaisedButton from 'material-ui/RaisedButton'
import ContentAdd from 'material-ui/svg-icons/content/add'
import Dialog from 'material-ui/Dialog'
import TextField from 'material-ui/TextField'
import {toastr} from '../../_shared/toastr'

let _ = require("lodash")

export class Orgs extends ReactComponent {
  id: number
  name: number
  openDialog: boolean = false
  creatingOrg: any = {name: ""}
  showComponentView: boolean  = true
  node: any

  onSelectNode(node: any) {
    this.id = node._data.id
    this.name = node._data.name
    this.creatingOrg.parentId = this.id
    this.update()
  }


  createOrg() {
    orgSvc.createOrg(this.creatingOrg).then(data => {
      toastr.ok(data.message)
      this.openOrCloseDialog()
      this.showComponentView = false
      this.update()
      this.showComponentView = true
      this.update()
    },err => {
      toastr.err("Организация не создана : "+err.responseJSON.errorMessage, "Ошибка") 
    })
  }

  orgName() {
    if (!this.name)
      return (<span></span>)
    else
      return (<span>&mdash; {this.name}</span>)
  }

  openOrCloseDialog() {
    this.openDialog = !this.openDialog
    this.update()
  }

  actions = [
      <RaisedButton
        style={{marginRight: "5px"}}
        label="Cancel"
        secondary={true}
        onTouchTap={this.openOrCloseDialog.bind(this)}
      />,
      <RaisedButton
        label="Ok"
        primary={true}
        onTouchTap={this.createOrg.bind(this)}
      />
  ]

  handleChangeCreatingOrgName = (event, index, value) => {
    this.creatingOrg.name = event.target.value
    this.update()
  };

  render() {
    return (
      <div>
        <h1>Организации {this.orgName()}</h1>

        <If value={this.showComponentView} content={() => {
          return (
            <div className="row" style={{paddingRight: "30px"}}>
              <div className="col-xs-4">
                <OrgTreeView onSelectNode={this.onSelectNode.bind(this)}/>

                <div>
                  <RaisedButton label="Добавить" primary={true}
                   style={{marginLeft: "15px"}} icon={<ContentAdd/>}
                   onTouchTap={this.openOrCloseDialog.bind(this)}/>
                  <Dialog
                    title="Создать организацию"
                    actions={this.actions}
                    modal={false}
                    open={this.openDialog}
                    onRequestClose={this.openOrCloseDialog.bind(this)}
                  >
                    <div style={{marginBottom: "-10px"}}><label>Название</label></div>
                    <TextField
                      hintText="Введите название организации"
                      value={this.creatingOrg.name} onChange={this.handleChangeCreatingOrgName}
                    /><br />
                  </Dialog>
                </div>
                
              </div>
              <If value={this.id} content={() => {
                return (
                  <div className="col-xs-8">
                    <Tabs  style={{minWidth: '569px'}}>          
                      <Tab label="Данные">
                        <Org orgId={this.id}></Org>
                      </Tab>
                      <Tab label="Пользователи">
                        <OrgUsers orgId={this.id}/>
                      </Tab>
                    </Tabs>
                  </div>
                )
              }}>
              </If>
            </div>
          )
        }}>
        </If>
      </div>
    )
  }
}
