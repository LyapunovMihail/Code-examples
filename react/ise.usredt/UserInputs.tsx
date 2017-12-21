import * as React from 'react'
import {ReactComponent, If} from "./refs"
import TextField from 'material-ui/TextField'
import Checkbox from 'material-ui/Checkbox'
import SelectField from 'material-ui/SelectField'
import MenuItem from 'material-ui/MenuItem'
import FlatButton from 'material-ui/FlatButton'
import RaisedButton from 'material-ui/RaisedButton'
import {orgUsersSvc} from './OrgUsersSvc'

import {toastr} from '../_shared/toastr'

const buttonGroupStyle = {
 	textAlign:"center",
  padding: "15px 15px 15px 0", 
  marginBottom: "30px"
}

export class UserInputs extends ReactComponent {

	u: any;
	orgList: any = [];
	changePassword:boolean = false;
	showRoles: boolean = false;

	changeRoles() {
		this.showRoles = !this.showRoles
		this.update()
	}

	getRoles(allRoles) {
		
		let rolesList = _.map(allRoles, (r, ind) => {
			
			return <Checkbox
	      name={r.name}
	      checked={r.checked}
	      onCheck={this.handleRolesChange}
	      label={getName(r)}
  			/>
  	})
		
		function getName(r) {
			if (r.title)
				return r.title
			else
				return r.name
		}
		return rolesList
	}

	handleRolesChange = (event, checked) => {
  	//this.u.allRoles[event.target.name] = checked
  	var role = _.find(this.u.allRoles, r => { return r.name == event.target.name });
  	role.checked = checked
  	
  	this.setState({})
	};

	handlePasswordChangeWithEmailDelivering = (event, checked) => {
  	this.u.passwordData.emailDeliver = checked
  	console.log("this.u.passwordData.emailDeliver: ", this.u.passwordData.emailDeliver)
  	this.setState({})
	};

	createOrUpdateUser() {
		if (this.u.id === 0) {
			orgUsersSvc.createUser(this.u).then(data => {
				toastr.ok(data.message)
				this.props.switchView()
				this.props.getUsers(true)
	    },err => {
	      toastr.err("Пользователь не создан : "+err.responseJSON.errorMessage, "Ошибка") 
	    })
		}
		else {
			orgUsersSvc.updateUser(this.u).then(data => {
				toastr.ok(data.message)
				this.props.switchView()
				this.props.getUsers(true)
	    },err => {
	      toastr.err("Пользователь не обновлен : "+err.responseJSON.errorMessage, "Ошибка") 
	    })
		}
	}

	editPassword() {
		orgUsersSvc.editPassword(this.u).then(data => {
			toastr.ok(data.message)
			this.openEditPassword()
      this.update()
    },err => {
      toastr.err("Пароль не обновлен : "+err.responseJSON.errorMessage, "Ошибка") 
    })
	}

	openEditPassword() {
		this.changePassword = !this.changePassword;
		this.update()
	}

  handleChange = (event, index, value) => {
  	if (event.target.name == "passwordData.password") {
  		this.u.passwordData.password = event.target.value
  	}
  	else
  		this.u[event.target.name] = event.target.value

  	this.setState({})
	};

	handleOrganizationChange = (event, index, value) => {
		this.u.mainOrganization = this.u['organizations'][value]
		this.u.mainOrganization.ind = value
  	this.setState({})
	};

	handleCheckboxesChange = (event, checked) => {
  	if (event.target.name === "active")
  		checked = !checked
  	this.u[event.target.name] = checked
  	this.setState({})
	};

  render(){
  	this.u = this.props.user
  	this.orgList = _.map(this.u.organizations, (o, ind) => {return <MenuItem key={ind} value={ind} primaryText={o.name}></MenuItem>})

    return (
	    <div style={{marginLeft: "40px"}}>
	      <TextField
	      value={this.u.email}
	      name="email"
	      onChange={this.handleChange}
	      floatingLabelText="Email"
	      /><br />
	      <TextField
	      value={this.u.name}
	      name="name"
	      onChange={this.handleChange}
	      floatingLabelText="Имя"
	      /><br />
	      <TextField
	      value={this.u.info}
	      name="info"
	      onChange={this.handleChange}
	      floatingLabelText="О себе"
	      /><br />
	      <TextField
	      value={this.u.privateContacts}
	      name="privateContacts"
	      onChange={this.handleChange}
	      floatingLabelText="Контакты (скрытые)"
	      /><br />
	      <TextField
	      value={this.u.telegramUsername}
	      name="telegramUsername"
	      onChange={this.handleChange}
	      floatingLabelText="Имя пользователя в Telegram"
	      /><br />
	      <TextField
	      value={this.u.startUrl}
	      name="startUrl"
	      onChange={this.handleChange}
	      floatingLabelText="Стартовая страница"
	      /><br />
	      <SelectField
	        floatingLabelText="Основная организация"
	        value={this.u.mainOrganization.ind}
	        onChange={this.handleOrganizationChange}
    			style={{whiteSpace: "normal"}}
	      >
	       	{this.orgList}
	      </SelectField><br />
	      <TextField style={{width: "263px"}}
	      value={this.u.adminNotes}
	      name="adminNotes"
	      onChange={this.handleChange}
	      floatingLabelText="Комментарий (для модераторов)"
	      multiLine={true}
	      rows={1}/><br /><br />
	      <Checkbox
	      name="isVerified"
	      checked={this.u.isVerified}
	      onCheck={this.handleCheckboxesChange}
	      label="Проверенный пользователь"
	    	/>
	    	<Checkbox
	    	name="active"
	    	checked={!this.u.active}
	    	onCheck={this.handleCheckboxesChange}
	      label="Заблокированный аккаунт"
	    	/>

        <If value={this.props.authUser && this.props.authUser.isModerator} content={() => {
          return (
          	<div>
	          	<FlatButton label="Изменить роли" style={{marginTop: "20px", marginBottom: "7px"}}
			    			onClick={this.changeRoles.bind(this)}/>
		      
				      <If value={this.showRoles} content={() => {
			          return (
			            <div>{this.getRoles(this.u.allRoles)}</div>
			          )
			        }}>
			        </If>
		        </div>
          )
        }}>
        </If>

        <If value={this.props.actionWithUser.action === "edit"} content={() => {
          return (
            <FlatButton label="Изменить пароль" style={{marginTop: "8px"}}
            onClick={this.openEditPassword.bind(this)}/>
          )
        }}>
        </If>

        <If value={this.props.actionWithUser.action === "edit" && this.changePassword} content={() => {
          return (
          	<div>
	            <TextField
	            	value={this.u.passwordData.password}
	            	name="passwordData.password"
	            	onChange={this.handleChange}
				        floatingLabelText="Новый пароль"
				        type="password"
							/><br /><br />
							<Checkbox
					      checked={this.u.passwordData.emailDeliver}
					      onCheck={this.handlePasswordChangeWithEmailDelivering}
					      label="Отправлять письмо при смене пароля"
					      style={{marginTop: "10px", marginBottom: "10px"}}
			  			/>
					    <FlatButton label="ОК"
				    	onClick={this.editPassword.bind(this)}/>
				    	<FlatButton label="Отмена"
				    	onClick={this.openEditPassword.bind(this)}/>
			    	</div>
          )
	      }}>
        </If>

        <br />
				<br />

				<div style={buttonGroupStyle}>
		    	<RaisedButton label="Сохранить" primary={true} style={{margin:"2px"}}
		    	onClick={this.createOrUpdateUser.bind(this)}/>
		    	<RaisedButton label="Отмена" secondary={true} style={{margin:"2px"}}
		    	onClick={this.props.switchView.bind(this, true)}/>
	    	</div>

	    </div>
	  );
  }
}