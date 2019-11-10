import { Component } from '@angular/core';
import {Socket}      from "ngx-socket-io";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'account';
  constructor(private socket:Socket) {
    socket.connect();
    socket.fromEvent('connect').subscribe((event) => {
      console.log(event, 'connected!');
    })
  }
}
