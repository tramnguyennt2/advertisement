import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import {ItemService} from "../../services/item.service";
import {Item} from "../../item";

@Component({
  selector: "app-item-detail",
  templateUrl: "./item-detail.component.html",
  styleUrls: ["./item-detail.component.scss"]
})
export class ItemDetailComponent implements OnInit {
  item: Item;
  id: string;
  constructor(private route: ActivatedRoute, private itemService: ItemService) {
    this.route.queryParams.subscribe(params => {
      this.id = params.id;
    });
  }

  ngOnInit() {
    this.itemService.getItem(this.id).then(item => this.item = item);
    let sidebarEl = document.getElementsByClassName("sidebar-lg-show");
    for (let i = 0; i < sidebarEl.length; i++) {
      sidebarEl[i].classList.remove("sidebar-lg-show");
    }
  }
}
