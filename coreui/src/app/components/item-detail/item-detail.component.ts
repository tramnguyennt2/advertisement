import {Component, Input, OnInit} from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import {ItemService} from "../../services/item.service";
import {Item} from "../../item";

@Component({
  selector: "app-item-detail",
  templateUrl: "./item-detail.component.html",
  styleUrls: ["./item-detail.component.scss"]
})
export class ItemDetailComponent implements OnInit {
  @Input() id;
  item = new Item();
  constructor(private itemService: ItemService) {

  }

  ngOnInit() {
    this.itemService.getItem(this.id).then(item => {
      this.item.setItem(item);
    });
    let sidebarEl = document.getElementsByClassName("sidebar-lg-show");
    for (let i = 0; i < sidebarEl.length; i++) {
      sidebarEl[i].classList.remove("sidebar-lg-show");
    }
  }
}
