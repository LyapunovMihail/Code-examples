import {React, ReactComponent, If} from '../../refs'
import {List, ListItem} from 'material-ui/List'
import FlatButton from 'material-ui/FlatButton'
import RaisedButton from 'material-ui/RaisedButton'
import {SelectDict} from '../../../_shared/select/selectDict'
import TextField from 'material-ui/TextField'
import {orgSvc} from './OrgSvc'
import {toastr} from '../../../_shared/toastr'

const sets = (name: string, url: string) => {
	return {
			name: name,
			url: url
		}
}

const selectStyle = {
	marginTop: "30px",
	width: "50%"
}

export class OrgEdit extends ReactComponent {

	org: any

	componentDidMount() {
    this.org = this.props.org
    this.update()
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.org.id !== nextProps.org.id) {
      this.props = nextProps
      this.org = this.props.org
      this.update()
    }
  }

  updateOrg() {
		orgSvc.updateOrg(this.org).then(data => {
			toastr.ok(data.message)
			this.props.refreshOrg(this.org)
			this.props.switchView()
			if (window.confirm("Перезагрузить страницу?") === true) {
				window.location.reload()
			}
    },err => {
      toastr.err("Организация не обновлена : "+err.responseJSON.errorMessage, "Ошибка") 
    })
	}

  handleChange = (prop, propName) => {
  	this.org[propName] = prop
	};

	handleChangeName = (event, index, value) => {
  	this.org[event.target.name] = event.target.value
  	this.update()
	};

  listItemSecondaryText(text) {
		let title
		if (text) title = text
		text = text || "-"
		return (<p><span style={{color: "black"}} title={title}>{text}</span></p>)
	}

	listItemPrimaryText(text) {
		return (<p><span style={{color: "gray"}}>{text}</span></p>)
	}

  render() {
    return (
	    <div>
	    	<If value={this.org} content={() => {
          return (	
          	<div>
          		<div>
          			<div><label>Название</label></div>
				    		<TextField
						      hintText="Введите название организации" style={{marginBottom: "-10px", marginTop: "-10px"}}
						      value={this.org.name} name="name" onChange={this.handleChangeName} fullWidth={true}
						    />
						    <br />
				    	</div>
				    	<div style={selectStyle}>
				    		<label>Родительская организация</label>
					    	<SelectDict settings={{name: "родительскую организацию", url: "/api/dict_orgs/find", title: "parent_companies"}}
					    	 prop={this.org.parent_companies[0]} handleChange={this.handleChange.bind(this)}/>
				    	</div>
          		<div style={selectStyle}>
				    		<label>Страна</label>
					    	<SelectDict settings={{name: "страну", url: "/api/dict_countries/find", title: "country"}}
					    	 prop={this.org.country} handleChange={this.handleChange.bind(this)}/>
				    	</div>
          		<div style={selectStyle}>
          			<label>Регион</label>
					    	<SelectDict settings={{name: "регион", url: "/api/dict_regions/find", title: "region"}}
					    	 prop={this.org.region} handleChange={this.handleChange.bind(this)}/>
				    	</div>
				    	<div  style={selectStyle}>
				    		<label>Контактное лицо</label>
					    	<SelectDict settings={{name: "контактное лицо", url: "/api/dict_users/find", title: "sec_obj_owner"}}
					    	 prop={this.org.sec_obj_owner} handleChange={this.handleChange.bind(this)}/>
				    	</div>
				    	<div  style={selectStyle}>
				    		<label>Спорт</label>
					    	<SelectDict settings={{name: "спорт", url: "/api/dict_sports/find", title: "sport"}}
					    	 prop={this.org.sport} handleChange={this.handleChange.bind(this)}/>
				    	</div>
				    	<div  style={selectStyle}>
				    		<label>Ответственный менеджер</label>
					    	<SelectDict settings={{name: "ответственного менеджера", url: "/api/dict_users/find", title: "manager"}}
					    	 prop={this.org.manager} handleChange={this.handleChange.bind(this)}/>
				    	</div>
				    	<RaisedButton label="Сохранить" primary={true} style={{margin: "40px 0 0 15px"}}
				    	onClick={this.updateOrg.bind(this)}/>
				    	<RaisedButton label="Отмена" secondary={true} style={{margin:"2px"}}
				    	onClick={this.props.switchView.bind(this)}/>
			    	</div>
          )
        }}>
        </If>
	    </div>
	  );
  }
}