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

  constructor(private itemService: ItemService, private userService: UserService, private cookieService: CookieService) {
  }

  ngOnInit() {
    if (this.id) {
      this.itemService.getItem(this.id).then(item => {
        this.item.setItem(item);
        this.userService.getUser(item.user_id).then(user => this.user.setUser(user));
      });
    }
    let sidebarEl = document.getElementsByClassName("sidebar-lg-show");
    for (let i = 0; i < sidebarEl.length; i++) {
      sidebarEl[i].classList.remove("sidebar-lg-show");
    }
  }
}
