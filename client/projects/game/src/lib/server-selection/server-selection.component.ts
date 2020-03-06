import { Component, OnInit } from "@angular/core";

@Component({
    selector   : "server-selection",
    templateUrl: "server-selection.component.html",
    styles     : []
})
export class ServerSelectionComponent implements OnInit {

    constructor() {
    }

    ngOnInit() {
    }

    onConnection(name: string) {
        console.log("connected!", name);
    }

}
