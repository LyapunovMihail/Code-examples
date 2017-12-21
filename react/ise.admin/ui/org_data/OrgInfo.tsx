import {React, ReactComponent, If} from '../../refs'
import {List, ListItem} from 'material-ui/List'
import FlatButton from 'material-ui/FlatButton'


export class OrgInfo extends ReactComponent {

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
			    	<List style={{marginBottom: "25px"}}>
			    		<img src={this.org.imageUrl} alt="..." className="img-thumbnail" width="80%"/>
			    		<div style={{marginLeft: "15px", marginTop: "23px", marginBottom: "10px", fontSize: "16px"}}>
			    			<a href={"/company/" + this.org.id} target="_blank">Профиль</a>
			    		</div>
				      <ListItem disabled={true} primaryText={this.listItemPrimaryText("Название")} 
				      secondaryText={this.listItemSecondaryText(this.org.name)}/>
				      <If value={this.org.parent_companies.length > 0} content={() => {
				      	return (
				      		<ListItem disabled={true} primaryText={this.listItemPrimaryText("Родительская организация")} 
				      		secondaryText={this.listItemSecondaryText(this.org.parent_companies[0].name)}/>
				      		)
				        }}>
				      </If>
				      <ListItem disabled={true} primaryText={this.listItemPrimaryText("Страна")} 
				      secondaryText={this.listItemSecondaryText(this.org.country.name)}/>
				      <ListItem disabled={true} primaryText={this.listItemPrimaryText("Регион")} 
				      secondaryText={this.listItemSecondaryText(this.org.region.name)}/>
				      <ListItem disabled={true} primaryText={this.listItemPrimaryText("Контактное лицо")} 
				      secondaryText={this.listItemSecondaryText(this.org.sec_obj_owner.name)}/>
				      <ListItem disabled={true} primaryText={this.listItemPrimaryText("Вид спорта")} 
				      secondaryText={this.listItemSecondaryText(this.org.sport.name)}/>
				      <ListItem disabled={true} primaryText={this.listItemPrimaryText("Ответственный менеджер")} 
				      secondaryText={this.listItemSecondaryText(this.org.manager.name)}/>

				      <FlatButton label="Редактировать" style={{margin: "40px 0 0 15px"}}
	    				onClick={this.props.switchView.bind(this)}/>
				    </List>
          )
        }}>
        </If>
	    </div>
	  );
  }
}