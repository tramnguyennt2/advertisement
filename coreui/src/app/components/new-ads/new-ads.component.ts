import { Component, OnInit } from "@angular/core";
import { ItemService } from "../../services/item.service";
import { Item } from "../../item";

@Component({
  selector: "app-new-ads",
  templateUrl: "./new-ads.component.html",
  styleUrls: ["./new-ads.component.scss"]
})
export class NewAdsComponent implements OnInit {
  items: Item[];
  constructor(private itemService: ItemService) {}

  ngOnInit() {
    this.itemService.getLatestItems().subscribe(items => (this.items = items));
  }
}
