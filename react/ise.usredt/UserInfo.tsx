import * as React from 'react'
import {ReactComponent, If} from "./refs"
import {List, ListItem} from 'material-ui/List'
import Checkbox from 'material-ui/Checkbox'
import FlatButton from 'material-ui/FlatButton'
import {SingleFileView} from '../_react/mui/SingleFileView'
import {SingleFileAttach} from '../_react/mui/SingleFileAttach'
import {orgUsersSvc} from './OrgUsersSvc'
import {toastr} from '../_shared/toastr'

export class UserInfo extends ReactComponent {
	u: any;

	rolesText() {
		let roles
		if (this.u.userRoles)
			roles = this.u.userRoles

		let rolesList
		if (roles && roles.length > 0) {
			rolesList = _.map(roles, (r, ind) => {
				return <p><span style={{color: "black"}} key={ind} value={ind}>{r}</span></p>})
		} else {
			return <p><span style={{color: "black"}}>-</span></p>
		}
		
		return rolesList
	}

	listItemSecondaryText(text) {
		let title
		if (text) title = text
		text = text || "-"
		return (<p><span style={{color: "black"}} title={title}>{text}</span></p>)
	}

	listItemPrimaryText(text) {
		return (<p><span style={{color: "gray"}}>{text}</span></p>)
	}

	isVerifiedUser() {
		if (this.u.isVerified)
			return (<span title="Проверенный пользователь" 
		          style={{color : "#1DCAFF", marginLeft: "16px"}}>
		          <i className="fa fa-check-circle"></i></span>)
	}

	avatarImage() {
		if (this.u.imageUrl)
			return this.u.imageUrl
		else
			return "/assets/images/no-image-available.png"
	}			

	avatarStyle = {
		marginTop: "24px"
	}

	buttonStyle = {
		marginTop: "15px"
	}
	
	onImageChanged(fileInfo) {
		var fileId = fileInfo ? fileInfo.id : 0;
		var url = fileInfo ? fileInfo.url : ""
		var isAvatar = fileInfo ? true : false
		orgUsersSvc.setUserAvatar(this.u.id, fileId).then(data => {
			toastr.ok(data.message)
			this.props.setUserImageFileId(fileId, url, isAvatar)
    },err => {
      toastr.err("Аватар не изменен: "+err.responseJSON.errorMessage, "Ошибка") 
    })
	}

  render(){
   this.u = this.props.user
   return (
	    <div style={{padding: "20px"}}>

	    	<If value={this.props.actionWithUser.action !== "create"} content={() => {
          return (
            <div style={{textAlign:"center"}}>
				    	<div style={this.avatarStyle}>
								<SingleFileAttach label="Загрузить фото" fileId={this.u.imageFileId} tag="logo"
								onChange={this.onImageChanged.bind(this)} />
							</div>
				    </div>
          )
        }}>
        </If>
	    	
	    	<div>
		    	<List style={{marginBottom: "25px"}}>
		    		<div style={{marginLeft: "15px", marginTop: "23px", marginBottom: "10px", fontSize: "16px"}}>
		    			<a href={"/account/" + this.u.id} target="_blank">Профиль</a>
		    		</div>
			      <ListItem disabled={true} primaryText={this.listItemPrimaryText("Email")} 
			      secondaryText={this.listItemSecondaryText(this.u.email)}
            />
			      <ListItem disabled={true} primaryText={this.listItemPrimaryText("Имя")} 
			      secondaryText={this.listItemSecondaryText(this.u.name)}/>
			      <ListItem disabled={true} primaryText={this.listItemPrimaryText("О себе")} 
			      secondaryText={this.listItemSecondaryText(this.u.info)}/>
			      <ListItem disabled={true} primaryText={this.listItemPrimaryText("Контакты (скрытые)")} 
			      secondaryText={this.listItemSecondaryText(this.u.privateContacts)}/>
			      <ListItem disabled={true} primaryText={this.listItemPrimaryText("Имя пользователя в Telegram")} 
			      secondaryText={this.listItemSecondaryText(this.u.telegramUsername)}/>
			      <ListItem disabled={true} primaryText={this.listItemPrimaryText("Стартовая страница")} 
			      secondaryText={this.listItemSecondaryText(this.u.startUrl)}/>
			      <ListItem disabled={true} primaryText={this.listItemPrimaryText("Основная организация")} 
			      secondaryText={this.listItemSecondaryText(this.u.mainOrganization.name)}/>
			      <ListItem disabled={true} primaryText={this.listItemPrimaryText("Комментарий (для модераторов)")} 
			      secondaryText={this.listItemSecondaryText(this.u.adminNotes)}/>
			      <If value={this.props.authUser && this.props.authUser.isModerator} content={() => {
		          return (
		          	<div>
			            <ListItem disabled={true} primaryText={this.listItemPrimaryText("Роли")}/>
						      <div style={{marginLeft: "16px", marginTop: "-20px", marginBottom: "20px"}}>
						      {this.rolesText()}</div>
					      </div>
		          )
		        }}>
		        </If>

			      <ListItem
		          leftCheckbox={<Checkbox checked={this.u.isVerified} disabled={true}
		          label={<div style={{display: "flex"}}><span>Проверенный пользователь</span>{this.isVerifiedUser()}</div>}/>}
		        />
        		<ListItem style={{marginTop: "33px"}} 
		          leftCheckbox={<Checkbox checked={!this.u.active} disabled={true} 
		          label="Заблокированный пользователь" />}
		        />
		        <FlatButton label="Редактировать" style={{margin: "40px 0 0 15px"}}
		    		onClick={this.props.switchView.bind(this, true)}/>	
			    </List>
		    </div>
		     
	    </div>
	  );
  }
}