import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {BasicComponent} from './basic.component';
import {ReportComponent} from './report.component';
import {StatisticsComponent} from './statistics.component';
import {AcrStatisticComponent} from './acrStatistic/acrStatistic.component';

const routes: Routes = [
  { path: 'main', component: BasicComponent },
  {
	  path: '',
	  redirectTo: '/main',
	  pathMatch: 'full'
	},
  { path: 'reports', component: ReportComponent },
  { path: 'stat', component: StatisticsComponent },
  { path: 'reports/acr', component: AcrStatisticComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
