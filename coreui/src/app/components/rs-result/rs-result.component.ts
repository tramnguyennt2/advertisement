import { Component, OnInit, Input } from "@angular/core";
import { RsService } from "../../services/rs.service";
import { ItemService } from "../../services/item.service";

@Component({
  selector: "app-rs-result",
  templateUrl: "./rs-result.component.html",
  styleUrls: ["./rs-result.component.scss"]
})
export class RsResultComponent implements OnInit {
  @Input()
  id;
  items = [];
  constructor(private rsService: RsService, private itemService: ItemService) {}

  ngOnInit() {
    this.rsService
      .getItemContentBased(this.id)
      .subscribe(items_rs =>
        this.getItemRs(items_rs).then(items => (this.items = items))
      );
  }

  async getItemRs(items_rs) {
    let items = [];
    for (const item of items_rs) {
      const contents = await this.itemService.getItem(item.id).then(item => {
        return item;
      });
      items.push(contents);
    }
    return items;
  }
}