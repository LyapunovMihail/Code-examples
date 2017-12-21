import * as React from 'react';
import {Component, PropTypes} from 'react'
import Avatar from 'material-ui/Avatar';
import {List, ListItem, makeSelectable} from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import Divider from 'material-ui/Divider';
import {deepOrange300, purple500} from 'material-ui/styles/colors';
import {OrgUsers} from './OrgUsers';

let SelectableList = makeSelectable(List);
let selectedIndex;
let currentUser;
function wrapState(ComposedComponent) {
  return class SelectableList extends Component<any,any> {
    static propTypes = {
      children: PropTypes.node.isRequired,
      defaultValue: PropTypes.number.isRequired,
    };

    componentWillMount() {
      selectedIndex = this.props.defaultValue
      currentUser = users[this.props.defaultValue]
      this.props.onUserSelected(currentUser)
    }

    handleRequestChange = (event, index) => {
      selectedIndex = index
      currentUser = users[index]
      this.props.onUserSelected(currentUser)
    };

    render() {
      return (
        <ComposedComponent
          value={selectedIndex}
          onChange={this.handleRequestChange}
        >
          {this.props.children}
        </ComposedComponent>
      );
    }
  };
}

SelectableList = wrapState(SelectableList);


const avatar = (u) => {
  if (u.isAvatar)
    return <Avatar src={u.imageUrl}/>
  else
    return <Avatar color={deepOrange300} backgroundColor={purple500}>{u.name.charAt(0)}</Avatar>
}

const listItemStyle = {
  minHeight:"46px", 
  lineHeight:"8px"
};
let users = [];

export const UserList = (props) => {
  users = props.users
  let userList = _.map(props.users, (u, ind) => {return <ListItem key={ind} value={ind} primaryText={u.name} leftAvatar={avatar(u)}></ListItem>})

  if (props.selectedIndex.setIndexToNull) {
    props.selectedIndex.setIndexToNull = false
    selectedIndex = -1
    currentUser = null
    props.onUserSelected(currentUser)
  }

  return (
    <div>
      <SelectableList defaultValue={0} onUserSelected={props.onUserSelected}>
        <Subheader inset={true}>Пользователи</Subheader>
        <Divider inset={true}/>
        {userList}
      </SelectableList>
    </div>
  );
}

