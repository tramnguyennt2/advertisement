import {Component, Input, OnInit} from "@angular/core";
import {ItemService} from "../../services/item.service";
import {Item} from "../../item";
import {UserService} from "../../services/user.service";
import {User} from "../../user";
import {CookieService} from 'ngx-cookie-service';

@Component({
  selector: "app-item-detail",
  templateUrl: "./item-detail.component.html",
  styleUrls: ["./item-detail.component.scss"]
})
export class ItemDetailComponent implements OnInit {
  @Input()
  id;
  item = new Item();
  user = new User();
  price = '';
  url: string;

  constructor(private itemService: ItemService, private userService: UserService, private cookieService: CookieService) {
  }

  ngOnInit() {
    if (this.id) {
      this.itemService.getItem(this.id).then(item => {
        this.item.setItem(item);
        this.userService.getUser(item.user_id).then(user => this.user.setUser(user));
        this.price = this.formatPrice(item.price);
        if(item.image){
          this.url = item.image;
        }
        else if(item._attachments){
          this.url = 'http://localhost:5984/advertisement/' + item._id + '/image';
        }
      });
    }
    let sidebarEl = document.getElementsByClassName("sidebar-lg-show");
    for (let i = 0; i < sidebarEl.length; i++) {
      sidebarEl[i].classList.remove("sidebar-lg-show");
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
