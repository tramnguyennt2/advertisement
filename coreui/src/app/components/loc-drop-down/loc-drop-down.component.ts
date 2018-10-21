import {Component, EventEmitter, OnInit, Output} from "@angular/core";
import {LocationService} from "../../services/location.service";
import {mouseenterLevel2} from "../../common";

@Component({
  selector: "app-loc-drop-down",
  templateUrl: "./loc-drop-down.component.html",
  styleUrls: ["./loc-drop-down.component.scss"]
})
export class LocDropDownComponent implements OnInit {
  locs = [];
  loc_str: string;
  loc_id = 0;
  loc: string = "Khu vực";
  @Output()
  subLocClick = new EventEmitter();

  constructor(private locService: LocationService) {
  }

  ngOnInit() {
    this.loadLocation();
  }

  loadLocation() {
    this.locService.getAllLocation().subscribe(locs => {
      this.locs = locs;
    });
  }

  clickSubLoc(event) {
    let oldEl = document.getElementsByClassName("current-level-2");
    for (let i = 0; i < oldEl.length; i++) {
      oldEl[i].classList.remove("active");
    }
    let curEl = event.currentTarget;
    const cls = ["active", "current-level-2"];
    curEl.classList.add(cls);
    this.subLocClick.emit({
      sub_loc_id: curEl.id,
      sub_loc: curEl.innerHTML,
      loc_id: this.loc_id,
      loc: this.loc_str
    });
    this.loc = curEl.innerHTML;
  }

  mouseenterLevel1(event) {
    let locEl = document.getElementsByClassName("current-level-1");
    for (let i = 0; i < locEl.length; i++) {
      locEl[i].children[1].classList.remove("show");
      locEl[i].children[0].classList.remove("active");
      locEl[i].classList.remove("current-level-1");
    }
    event.currentTarget.classList.add("active");
    let newEl = event.currentTarget.parentElement;
    this.loc_id = newEl.id;
    this.loc_str = newEl.firstElementChild.innerHTML;
    newEl.classList.add("current-level-1");
    newEl.children[1].classList.add("show");
  }

  mouseenterLevel2(event) {
    mouseenterLevel2(event);
  }
}
