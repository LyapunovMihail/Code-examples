import {React} from '../refs'

const Todo = (name) => {
  return ((props) => {
    return (<div>
      <h1>{name}</h1>
      {props.children}
      </div>)
  });
}

export const Dashboard = Todo("Dashboard")
