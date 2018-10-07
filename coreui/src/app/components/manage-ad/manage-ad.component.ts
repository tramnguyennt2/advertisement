import { Component, OnInit } from '@angular/core';
import {ItemService} from "../../services/item.service";
import { Item } from "../../item";
import {CookieService} from "ngx-cookie-service";

@Component({
  selector: 'app-manage-ad',
  templateUrl: './manage-ad.component.html',
  styleUrls: ['./manage-ad.component.scss']
})
export class ManageAdComponent implements OnInit {
  items: Item[];
  userId: string;

  constructor(
    private cookieService: CookieService,
    private itemService: ItemService
  ) {}

  ngOnInit() {
    let sidebarEl = document.getElementsByClassName("sidebar-lg-show");
    for (let i = 0; i < sidebarEl.length; i++) {
      sidebarEl[i].classList.remove("sidebar-lg-show");
    }
    this.userId = this.cookieService.get('user_id');
    this.itemService.getItemByUser(this.userId).subscribe(res => {
      this.items = res;
    });
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

  onClickUpdate(){
    window.open("post-ad", "_blank");
  }

  deleteItem(id){
    this.itemService.delete(id);
  }

  reload(){
    window.location.reload();
  }

}
