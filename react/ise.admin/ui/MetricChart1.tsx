import {React, ReactComponent, Event, toastr, AppState} from '../refs'
import {AppBtn} from '../mui'
import {SelectMetric} from '../../_shared/select/selectMetric'
import {metricsSvc} from '../../_services/metricsSvc'
import {DygraphChart} from '../../_react/ui/chartjs/DygraphsChart'
import {timeSvc} from '../../_services/timeSvc'
import {ServerEvents} from '../../_utils/messageUtils'

let _ = require("lodash")

export class MetricChart1 extends ReactComponent {

  onUpdate = Event.create()

  options: any = {}

  initializing = true;

  componentDidMount(){
    this.load();
    AppState.i().serverEvents.on(this, `new.${this.props.metric.text}`, (x) => {
      this.addItem(x);
      this.onUpdate(this.chartData);
    });
  }

  labels: any = [];

  chartData: any = []

  _addItem(dt, min, avg, max){
    this.chartData.push([dt, min, avg, max]);
  }

  round2(x){
    return Math.round(x * 100) / 100;
  }

  addItem(x){
    if (x.n && (x.avg === 0 && x.min === 0 && x.max === 0) ) {
      let sec = (x.d || 0.0) / 1000;
      let fr = (sec > 0) ? this.round2((x.n / sec)) : x.n ;
      this._addItem(timeSvc.utcToLocalDate(x.t), 0, fr, 0);
    } else {
      this._addItem(timeSvc.utcToLocalDate(x.t), x.min, x.avg, x.max)
    }
  }


  load(){

    this.initializing = true;
    metricsSvc.getData(this.props.metric.id).then(data => {

      _.each(data, x => {
        this.addItem(x);
      })

      this.options = {
        drawPoints: false,
        showRoller: true,
        showRangeSelector: true,
        labels: ['Time', 'Min', 'Avg', 'Max']
      };

      this.initializing = false;
      this.update();
    });
    this.update();
  }

  render(){
    const m = this.props.metric;
    const chartStyle={ width: "100%", height: "200px" }
    let view;
    if (this.initializing){
      view = <h3 className="text-muted">Загрузка...</h3>;
    } else {
      view = (<div className="dyngraph-container"><DygraphChart style={chartStyle} options={this.options} data={this.chartData} onUpdate={this.onUpdate} /></div>);
    }
    return (<div>
        {view}
        <hr/>
      </div>);
  }
}
