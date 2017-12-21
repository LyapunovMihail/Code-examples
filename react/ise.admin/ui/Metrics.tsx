import {React, ReactComponent, Event, toastr, AppState} from '../refs'
import {AppBtn} from '../mui'
import {SelectMetric} from '../../_shared/select/selectMetric'
import {metricsSvc} from '../../_services/metricsSvc'
import {Chart} from '../../_react/ui/chartjs/Chart'
import {timeSvc} from '../../_services/timeSvc'
import {MetricChart1} from './MetricChart1'

let _ = require("lodash")

const MetricView = (props) => {
  return (<div>
      <div className="row">
        <div className="col-md-10">
          <h3>{props.item.text}</h3>
        </div>
        <div className="col-md-2">
          <AppBtn icon="delete" onClick={props.onRemove} />
        </div>
      </div>
      <MetricChart1 metric={props.item} />
    </div>);
}

export class Metrics extends ReactComponent {

metrics : any = []

onMetricSelect(e){
  if (e){
    this.metrics.push(e);
    this.update();
  }
}

onRemove(x){
  const i = this.metrics.indexOf(x);
  if (i !== -1) {
    this.metrics.splice(i, 1);
    this.update();
  }
}

onHightHeartBeat(x){
  metricsSvc.hightFrequencyHeartbeat();
}

initalMetricNames = [
"awf.webapp.count.request", "awf.webapp.duration.request",
"ise.webapp.users.online", "system.mem.usage%", "system.cpu.usage%", "system.disk.usage%",
"ise.webapp.db.table.auth_session.rowCount",
"ise.webapp.db.table.json_collection.rowCount",
"ise.webapp.db.table.users.rowCount", "ise.webapp.db.table.person.rowCount",
"ise.webapp.db.table.acr.rowCount", "ise.webapp.db.table.att.rowCount",
"ise.webapp.db.table.comp.rowCount",
"ise.webapp.db.table.metrics.rowCount", "ise.webapp.db.table.metrics_data.rowCount"]

loadInital(){
  let p = _.map(this.initalMetricNames, x => {
    return metricsSvc.findByName(x)
  });

  Promise.all(p).then(data => {
    let d1 = _.compact(data);
    this.metrics = this.metrics.concat(d1);
    this.update();
  })
}

componentDidMount(){
  this.loadInital();
  const se = AppState.i().serverEvents;

  se.on(this, "hfm.activated", () => {
    toastr.ok("Hight frequency mode activated");
  });

  se.on(this, "hfm.deactivated", () => {
    toastr.info("Hight frequency mode deactivated");
  });
}

render (){
  const items = _.map(this.metrics, (x, i) => {
    return  (<MetricView key={i} onRemove={this.onRemove.bind(this, x)} item={x} />)
  })

  return (
    <div>
      <div className="row">
        <div className="col-md-9">
          <SelectMetric onSelect={this.onMetricSelect.bind(this)}/>
        </div>
        <div className="col-md-3">
          <AppBtn label="Hight frequency mode" onClick={this.onHightHeartBeat.bind(this)} />
        </div>
      </div>

      <div className="row">
        <div className="col-md-12">
          {items}
        </div>
      </div>

    </div>
  )
}
}
