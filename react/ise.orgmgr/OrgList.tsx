import {React} from './refs';

import {List, ListItem} from 'material-ui/List';
import ActionGrade from 'material-ui/svg-icons/action/grade';
import CommunicationBusiness from 'material-ui/svg-icons/communication/business';
import ContentDrafts from 'material-ui/svg-icons/content/drafts';
import ContentSend from 'material-ui/svg-icons/content/send';
import PlacesPool from 'material-ui/svg-icons/places/pool';
import SocialSchool from 'material-ui/svg-icons/social/school';
import ActionСard_membership from 'material-ui/svg-icons/action/card-membership';
import SocialPerson from 'material-ui/svg-icons/social/person';
import Subheader from 'material-ui/Subheader';
import Toggle from 'material-ui/Toggle';
import Avatar from 'material-ui/Avatar';
import Badge from 'material-ui/Badge';
import {
blue300,
indigo900,
orange200,
deepOrange300,
pink400,
purple500,
} from 'material-ui/styles/colors';

export class OrgList extends React.Component<any, any> {

  state = {
    open: false,
  };

  handleToggle = () => {
    this.setState({
      open: !this.state.open,
    });
  };

  handleNestedListToggle = (item) => {
    this.setState({
      open: item.state.open,
    });
  };

  organizationName() {
    return <span>{this.props.item.name}<a style={{fontSize: "12px"}} href={"/company/"+ this.props.item.id} target="_blank"> Перейти в организацию</a></span>
  }

  avatar = (x) => {
    if (x.isAvatar)
      return <Avatar src={x.imageUrl}/>
    else
      return <Avatar color={deepOrange300} backgroundColor={purple500}>{x.name.charAt(0)}</Avatar>
  }

  isModerateComp(x) {
    if (!x.approved)
      return <span style={{marginLeft: "10px"}} className="label label-warning">На модерации</span>
  }

  badges = {acr:0,att:0};

  isClosedAcr(x) {
    var color;
    if (x.isClosed === "Закрыт")
      color = "label-warning"
    else {
      color = "label-success"
      this.badges.acr++;
    }

    return <span style={{marginLeft: "10px"}} className={"label " + color}>{x.isClosed}</span>
  }

  isClosedAtt(x) {
    var color;
    if (x.isClosed === "Закрыто")
      color = "label-warning"
    else if (x.isClosed !== "В архив") {
      color = "label-success"
      this.badges.att++;
    }
    return <span style={{marginLeft: "10px"}} className={"label " + color}>{x.isClosed}</span>
  }

  comps = _.map(this.props.item.comps, (x) => {if (!x.closed) return <ListItem primaryText={<span><a target="_blank" href={"/taekwondo/tournament/"+ x.id}>{x.name}</a>{this.isModerateComp(x)}</span>} 
    secondaryText={<span><p>Дата регистрации: {x.dateReg}<p>Дата проведения: {x.dateWhen}</p></p></span>} secondaryTextLines={2} />});  
  acrs = _.map(this.props.item.acrs, (x) => <ListItem primaryText={<span><a target="_blank" href={"/acr/event/" + x.id}>{x.name}</a>{this.isClosedAcr(x)}</span>} secondaryText={<p>Дата аккредитации: {x.dateWhen}, до {x.dateTill}</p>} secondaryTextLines={1} />);
  
  atts = _.filter(this.props.item.atts, (x) => {return x.isClosed !== "В архив"});
  
  users = _.map(this.props.item.users, (x) => <ListItem primaryText={<span><a target="_blank" href={"/account/" + x.id}>{x.name}</a><a style={{fontSize: "12px"}} target="_blank" href={"/loginas?email=" + x.email}> login as</a></span>} leftAvatar={this.avatar(x)} />);

  

  render() {
    this.atts = _.map(this.atts, (x) => {return <ListItem primaryText={<span><a target="_blank" href={"/att/event/" + x.id}>{x.name}</a>{this.isClosedAtt(x)}</span>} secondaryText={<p>Дата аттестации: {x.dateWhen}, {x.tq}</p>} secondaryTextLines={1}/>}); 

    return (
      <div style={{marginTop: '20px'}}>
        <br />
          <List>
            <ListItem
              primaryText={this.organizationName()}
              leftIcon={<CommunicationBusiness />}
              initiallyOpen={true}
              primaryTogglesNestedList={true}
              nestedItems={[   
                <ListItem
                  key={1}
                  primaryText={<span>Соревнования <span className="badge green">{this.comps.length}</span></span>}
                  leftIcon={<PlacesPool />}
                  primaryTogglesNestedList={true}
                  nestedItems={[
                    this.comps
                  ]}
                ></ListItem>,
                <ListItem
                  key={2}
                  primaryText={<span>Аккредитации <span className="badge green">{this.badges.acr}</span></span>}
                  leftIcon={<ActionСard_membership />}
                  primaryTogglesNestedList={true}
                  nestedItems={[
                    this.acrs
                  ]}
                ></ListItem>,
                <ListItem
                  key={3}
                  primaryText={<span>Аттестации <span className="badge green">{this.badges.att}</span></span>}
                  leftIcon={<SocialSchool />}
                  primaryTogglesNestedList={true}
                  nestedItems={[
                    this.atts
                  ]}
                ></ListItem>,
                <ListItem
                  key={4}
                  primaryText={<span>Пользователи <span className="badge green">{this.users.length}</span></span>}
                  leftIcon={<SocialPerson />}
                  primaryTogglesNestedList={true}
                  nestedItems={[
                    this.users
                  ]}
                ></ListItem>
              ]}
            />
          </List>
      </div>
    );
  }
}