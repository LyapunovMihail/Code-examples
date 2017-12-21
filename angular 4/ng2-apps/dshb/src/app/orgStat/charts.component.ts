import {Component, OnInit, Input, ElementRef} from '@angular/core';
import {DataContainer} from './dataContainer';

import * as _ from 'lodash';
declare var google;

@Component({
    selector: 'charts',
    templateUrl: './charts.component.html',
    //directives: [],
    //providers: []
})
export class Charts implements OnInit {

  _dc: DataContainer;

  get dc(): DataContainer {
    return this._dc;
  }

  @Input()
  set dc(value: DataContainer) {
     this._dc = value;
     this.delayedRefresh();
  }

  @Input()
  root: any;

  loaded = false;
  values: any;
  height: number;

  delayedRefresh:  any;

  constructor(private el: ElementRef) {

    this.delayedRefresh = _.debounce(()=> {         
        this.refresh();
     }, 700);

  }

  refresh(){
    if (!this.dc) return
    
    
    this.values = []; 

    var allValues = _.map(this.catValues, x => {
      return {name: x.title, n: this.dc.getValue(x.id)}
    })
   
    //console.log("1) allValues", allValues)

    allValues = allValues.sort((a,b) => {
      return b.n - a.n
    })

    //console.log("2) sort", allValues)

    var count = 0;
    var sum = 0;
    var values = [];

    _.each(allValues, x => {
      count++;
      if (count > 8) {
        sum += x.n
      }
      else 
        values.push([x.name, x.n])
    })

    if (count > 8 && sum > 0) values.push(['Остальные', sum]);

    if (values.length === 9)
      this.height = 300
    else if (values.length < 9 && values.length >= 5)
      this.height = 200
    else
      this.height = 100


    //console.log("3) values", values)

    this.drawChart(values)
  }

  ngOnInit() {
    google.charts.load('current', {packages: ['corechart']});
    this.root.onCatChange.subscribe(x => {
      this.delayedRefresh();
    });

    this.delayedRefresh();  
  }


  drawChart(values) {
    //if (!this.loaded) return;
    if (!(google && google.visualization)) return;
    // Create the data table.
    var data = new google.visualization.DataTable();
    data.addColumn('string', 'Название');
    data.addColumn('number', 'Кол-во');
    data.addRows(values);

    // Set chart options
    var options = {'title':'',
                   'width':400,
                   'height':this.height,
                   backgroundColor: '#fafafa'};

    // Instantiate and draw our chart, passing in some options.
    var chart = new google.visualization.PieChart(this.el.nativeElement);
    chart.draw(data, options);
  }

  get catValues(){
    if (!this.dc) return [];
    if (!this.root) return [];
    return _.filter(this.root.catValues, x => !!this.dc.getValue(x.id)) ;
  }
}
