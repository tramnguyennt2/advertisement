import {Component, OnInit, Input} from "@angular/core";
import {RsService} from "../../services/rs.service";
import {ItemService} from "../../services/item.service";
import {CookieService} from 'ngx-cookie-service';
import {UserBehavior} from "../../user-behavior";
import {Item} from "../../item";

@Component({
  selector: "app-rs-result",
  templateUrl: "./rs-result.component.html",
  styleUrls: ["./rs-result.component.scss"]
})
export class RsResultComponent implements OnInit {
  @Input()
  item_id;
  items = [];
  rating: UserBehavior;

  constructor(private rsService: RsService, private itemService: ItemService, private cookieService: CookieService) {
  }

  ngOnInit() {
    //------------------CB-----------------
    this.items = [];
    this.rsService.getItemContentBased(this.item_id).subscribe(items_rs =>
      this.getItemRecommended(items_rs).then(items => {
        for (let i = 0; i < items.length; i++) {
          let item = new Item();
          item.setItem(items[i]);
          this.items.push(item);
        }
      })
    );

    let user_id = this.cookieService.get('user_id');
    if (user_id !== '') {
      this.saveUserBehavior(this.item_id, user_id).then(() => {
        this.items = [];
        //------------------CF-----------------
        // this.rsService.getItemCollaborativeFiltering(user_id).subscribe(items_rs =>
        //   this.getItemRecommended(items_rs).then(items => {
        //     for (let i = 0; i < items.length; i++) {
        //       let item = new Item();
        //       item.setItem(items[i]);
        //       this.items.push(item);
        //     }
        //   })
        // );
        //------------------HB-----------------
        // this.rsService.getHybridMethod(this.item_id, user_id).subscribe(items_rs =>
        //   this.getItemRecommended(items_rs).then(items => {
        //     for (let i = 0; i < items.length; i++) {
        //       let item = new Item();
        //       item.setItem(items[i]);
        //       this.items.push(item);
        //     }
        //   })
        // );
        //------------------GRAPH METHOD-----------------
        // this.rsService.getGraphMethod(user_id).subscribe(items_rs =>
        //   this.getItemRecommended(items_rs).then(items => {
        //     for (let i = 0; i < items.length; i++) {
        //       let item = new Item();
        //       item.setItem(items[i]);
        //       this.items.push(item);
        //     }
        //   })
        // );
      });
    }
  }

  async getItemRecommended(items_rs) {
    let items = [];
    for (const item of items_rs) {
      if (item.id != this.item_id) {
        const contents = await this.itemService.getItem(item.id).then(item => {
          return item;
        });
        items.push(contents);
      }

    }
    return items;
  }

  saveUserBehavior(item_id, user_id) {
    return new Promise((resolve, reject) => {
        this.rating = new UserBehavior(user_id, item_id);
        this.itemService.getItemOfRating(this.rating).subscribe(rating => {
          if (rating === null) {
            this.itemService.add(this.rating);
          } else {
            this.itemService.updateRating(rating);
          }
        });
        resolve("Done");
      }
    );

  }
}
