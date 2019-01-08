import { Component, Input, OnInit } from "@angular/core";
import { ItemService } from "../../services/item.service";

@Component({
  selector: "app-item",
  templateUrl: "./item.component.html",
  styleUrls: ["./item.component.scss"]
})
export class ItemComponent implements OnInit {
  @Input()
  item;
  price = "";
  url: string;
  constructor(private itemService: ItemService) {}

  ngOnInit() {
    this.price = this.formatPrice(this.item.price);
    this.itemService.getItem(this.item.id).then(item => {
      if (item.image && item.image != "khong co") {
        this.url = item.image;
      } else if (item._attachments) {
        this.url = "http://localhost:5984/advertisement/" + item._id + "/image";
      }
    });
  }

  formatPrice(price) {
    let arr = [];
    while (price.length > 3) {
      arr.push(price.slice(-3));
      price = price.slice(0, price.length - 3);
    }
    arr.push(price);
    let newPrice = "";
    arr.map(str => {
      newPrice = "," + str + newPrice;
    });
    return newPrice.slice(1);
  }
}
