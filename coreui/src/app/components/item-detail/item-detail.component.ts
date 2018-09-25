import { Component, Input, OnInit } from "@angular/core";
import { ItemService } from "../../services/item.service";
import { Item } from "../../item";
import { UserBehavior } from "../../user-behavior";
import {UserService} from "../../services/user.service";

@Component({
  selector: "app-item-detail",
  templateUrl: "./item-detail.component.html",
  styleUrls: ["./item-detail.component.scss"]
})
export class ItemDetailComponent implements OnInit {
  @Input()
  id;
  item = new Item();
  rating: UserBehavior;
  constructor(private itemService: ItemService, private userService: UserService) {}

  ngOnInit() {
    if(this.id){
      this.itemService.getItem(this.id).then(item => {
        this.item.setItem(item);
        this.userService.getUser(item.user_id).then(user => console.log(user));
        // this.saveUserBehavior(this.item.id);
      });
    }
    let sidebarEl = document.getElementsByClassName("sidebar-lg-show");
    for (let i = 0; i < sidebarEl.length; i++) {
      sidebarEl[i].classList.remove("sidebar-lg-show");
    }
  }
  saveUserBehavior(item_id) {
    this.rating = new UserBehavior("4", item_id);
    this.itemService.getItemOfRating(this.rating).subscribe(rating => {
      if (rating === null) {
        this.itemService.add(this.rating);
      } else {
        this.itemService.updateRating(rating);
      }
    });
  }
}
