import { BrowserModule } from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import {OrgdupService} from './orgdup.service';
import {ToastModule} from 'ng2-toastr/ng2-toastr';

import { OrgDuplicateComponent } from './orgdup.component';

@NgModule({
  declarations: [
    OrgDuplicateComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpModule,
    ToastModule.forRoot()
  ],
  providers: [OrgdupService],
  bootstrap: [OrgDuplicateComponent]
})
export class AppModule { }
