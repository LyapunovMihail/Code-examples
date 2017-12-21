import {React, ReactComponent, Event} from "./refs"
import {mui} from './mui'
import {authSvc} from '../_services/authSvc'

const UserAvatar = (props) => {
  const u = props.user;
  const view = (()=> {
    if (u && u.image) {
      return (<mui.Avatar style={props.style} src={u.image} />);
    } else if (u) {
      var a = (u.name||"").substring(0,1).toUpperCase();
      return (<mui.Avatar style={props.style}>{a}</mui.Avatar>)
    } else {
      return (<mui.Avatar style={props.style}>?</mui.Avatar>)
    }
  })()
  return view;
}

export class AppBarView extends ReactComponent {

  onLeftIconButtonTouchTap(){
      
  }

  user: any;

  componentDidMount(){
    authSvc.then(u => {
        this.user = u;
        this.update();
    })
  }

render (){
  return (
    <mui.AppBar title="АРМ Менеджер"
      showMenuIconButton={false}
      onLeftIconButtonTouchTap={this.onLeftIconButtonTouchTap}
      iconElementRight={
        <mui.ToolbarGroup>
          <mui.ToolbarTitle style={{color: "#fff", marginTop: "-3px"}} text={this.user ? this.user.name: ""} />
          <UserAvatar style={{marginTop: "3px"}} user={this.user} />
          <mui.IconMenu
            iconButtonElement={
              <mui.IconButton><mui.FontIcon className="material-icons" color="#fff">more_vert</mui.FontIcon></mui.IconButton>
            }
            targetOrigin={{horizontal: 'right', vertical: 'bottom'}}
            anchorOrigin={{horizontal: 'right', vertical: 'bottom'}}
          >
            <mui.MenuItem primaryText="Мой профиль" href={this.user ? `/account/${this.user.id}`: "/account/home"} />
            <mui.MenuItem primaryText="Выйти" href="/signout" />
          </mui.IconMenu>
        </mui.ToolbarGroup>
      }
    />
  )
}

}
