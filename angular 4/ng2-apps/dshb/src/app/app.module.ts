import 'hammerjs';

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { MaterialModule } from '@angular/material';
import { FlexLayoutModule } from "@angular/flex-layout";

import { AppRoutingModule } from './app-routing.module';

import { BasicService } from './basic.service';
import { ScrService } from '../../../../_services/scrSvc';
import {UvrfService} from '../../../../_services/uvrfSvc';
import {MyChildrenService} from './myChildren/myChildren.service';
import {AcrService} from '../../../../_services/acrSvc';
import {OrgStatService} from './orgStat/orgStat.service';

import {DshbRouterComponent} from './dshbApp.routerComponent';
import {BasicComponent} from './basic.component';
import {BasicElementComponent} from './basicElement/basic.element.component';
import {MyChildrenComponent} from './myChildren/myChildren.component';
import {ReportComponent} from './report.component';
import {StatisticsComponent} from './statistics.component';
import {AcrStatisticComponent} from './acrStatistic/acrStatistic.component';

import {OrgStatComponent} from './orgStat/orgStat.component';
import {OrgStatItem} from "./orgStat/orgStatItem.component";
import {FilterItem} from "./orgStat/filterItem.component";
import {OrgFilter} from "./orgStat/orgFilter.component";
import {Charts} from './orgStat/charts.component';
import {FilterPercents} from './orgStat/filterChilds.pipe';
import {CfgDialog} from './orgStat/orgStat.component';
import {SpmPopupDialog} from './orgStat/orgStat.component';
import {EditSelectedDialog} from './orgStat/orgStat.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {ToastModule} from 'ng2-toastr/ng2-toastr';

import {MdSidenavModule, MdToolbarModule, MdListModule, MdIconModule, MdIconRegistry,
        MdCardModule, MdButtonModule, MdCheckboxModule, MdRadioModule,
        MdDialogModule, MdSlideToggleModule} from '@angular/material';

@NgModule({
  declarations: [
    DshbRouterComponent,
    BasicComponent,
    BasicElementComponent,
    MyChildrenComponent,
    ReportComponent,
    StatisticsComponent,
    AcrStatisticComponent,

    OrgStatComponent,
    OrgStatItem,
    FilterItem,
    OrgFilter,
    Charts,
    FilterPercents,
    CfgDialog,
    SpmPopupDialog,
    EditSelectedDialog
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule, 
    ToastModule.forRoot(),
    FormsModule,
    HttpModule,
    AppRoutingModule,
    MaterialModule,
    FlexLayoutModule,

    MdSidenavModule,
    MdToolbarModule,
    MdListModule,
    MdIconModule,
    MdCardModule,
    MdButtonModule,
    MdCheckboxModule,
    MdRadioModule,
    MdDialogModule,
    MdSlideToggleModule
  ],
  providers: [
    BasicService,
    ScrService,
    UvrfService,
    MyChildrenService,
    AcrService,
    OrgStatService
  ],
  entryComponents: [
    CfgDialog,
    SpmPopupDialog,
    EditSelectedDialog
  ],
  bootstrap: [DshbRouterComponent]
})
export class AppModule {
}
