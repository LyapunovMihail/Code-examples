import {State} from '../_app/state'
import {ServerEvents} from '../_utils/messageUtils'

export class AppState extends State {

  static instance(): AppState  {
    return AppState.i()
  }

  static i(): AppState  {
    return <AppState>State.state
  }

  serverEvents = new ServerEvents("metrics");

}
