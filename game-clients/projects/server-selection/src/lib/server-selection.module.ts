import { NgModule }                 from '@angular/core';
import { ServerSelectionComponent } from './server-selection.component';
import {MatCardModule}              from "@angular/material/card";
import {ServerListModule}           from "../../../server-list/src/lib/server-list.module";



@NgModule({
  declarations: [ServerSelectionComponent],
    imports: [
        MatCardModule,
        ServerListModule
    ],
  exports: [ServerSelectionComponent]
})
export class ServerSelectionModule { }
