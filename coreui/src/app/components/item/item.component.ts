import { Component, Input, OnInit } from "@angular/core";

@Component({
  selector: "app-item",
  templateUrl: "./item.component.html",
  styleUrls: ["./item.component.scss"]
})
export class ItemComponent implements OnInit {
  @Input()
  item;
  price = '';
  url: string;
  constructor() {}

  ngOnInit() {
    this.price = this.formatPrice(this.item.price);
    if(this.item._attachments){
      this.url = 'http://localhost:5984/advertisement/' + this.item.id + '/image';
      console.log(this.url)
    }
  }

  formatPrice(price){
    var price = price;
    let arr = [];
    while (price.length > 3) {
      arr.push(price.slice(-3));
      price = price.slice(0, price.length - 3);
    }
    arr.push(price);
    let newPrice = '';
    arr.map(str => {
      newPrice = ',' + str + newPrice;
    });
    return newPrice.slice(1);
  }
}
