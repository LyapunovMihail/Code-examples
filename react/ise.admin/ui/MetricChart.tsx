import {React, ReactComponent, Event, toastr, AppState} from '../refs'
import {AppBtn} from '../mui'
import {SelectMetric} from '../../_shared/select/selectMetric'
import {metricsSvc} from '../../_services/metricsSvc'
import {Chart} from '../../_react/ui/chartjs/Chart'
import {timeSvc} from '../../_services/timeSvc'
import {ServerEvents} from '../../_utils/messageUtils'

let _ = require("lodash")

export class MetricChart extends ReactComponent {

  onUpdate = Event.create()

  options: any = {}

  initializing = true;

  componentDidMount(){
    this.load();
    AppState.i().serverEvents.on(this, `new.${this.props.metric.text}`, (x) => {
      this.addItem(x);
      this.onUpdate();
    });
  }

  labels: any = [];
  mins: any = [];
  avgs: any = [];
  maxs: any = [];

  last: any;

  _add(name, val){
    name = name+"s";
    let a = this[name];
    a.push(val);
    if (a.length > 1000) {
      a.splice(0, 1);
    }
  }

  _addItem(label, min, avg, max){
    let x = this.last;
    if (x){
      let isSame = (x.min === min) && (x.avg === avg) && (x.max === max);
      //if (isSame) return;
    }

    this.last = {
      min, avg, max
    };

    this._add("label", label);
    this._add("min", min);
    this._add("avg", avg);
    this._add("max", max);
  }

  addItem(x){
    if (x.n && (x.avg === 0 && x.min === 0 && x.max === 0) ) {
      this._addItem(timeSvc.fmtDateTimeSmart(x.t), 0, x.n, 0);
    } else {
      this._addItem(timeSvc.fmtDateTimeSmart(x.t), x.min, x.avg, x.max)
    }
  }

  load(){
    const ds = (label, data, col) => {
      return { label, data , backgroundColor: col , borderColor : col, fill: false,
        pointRadius: 1,
        pointBorderWidth: 1}
    }
    this.initializing = true;
    metricsSvc.getData(this.props.metric.id).then(data => {
      this.options = {
        type: 'line',
        data: {
          labels: this.labels,
          datasets: [ ds("Min", this.mins, "#42A5F5"),
          ds("Avg", this.avgs, "#66BB6A"),
          ds("Max", this.maxs, "#EF5350")]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false
        }
      };

      _.each(data, x => {
        this.addItem(x);
      })

      this.initializing = false;
      this.update();
    });
    this.update();
  }

  render(){
    const m = this.props.metric;
    let view;
    if (this.initializing){
      view = <h3 className="text-muted">Загрузка...</h3>;
    } else {
      view = (<div className="cartjs-container"><Chart options={this.options} onUpdate={this.onUpdate} /></div>);
    }
    return (<div>
        {view}
        <hr/>
      </div>);
  }
}
