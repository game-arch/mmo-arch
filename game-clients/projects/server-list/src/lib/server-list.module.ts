import { NgModule }            from '@angular/core';
import { ServerListComponent } from './server-list.component';
import {MatListModule}         from "@angular/material/list";
import {CommonModule}          from "@angular/common";



@NgModule({
  declarations: [ServerListComponent],
    imports: [
        MatListModule,
        CommonModule
    ],
  exports: [ServerListComponent]
})
export class ServerListModule { }
