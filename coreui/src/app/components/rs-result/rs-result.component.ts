import {Component, Input, OnInit} from "@angular/core";
import {RsService} from "../../services/rs.service";
import {ItemService} from "../../services/item.service";
import {CookieService} from "ngx-cookie-service";
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
  images = [];

  constructor(private rsService: RsService, private itemService: ItemService, private cookieService: CookieService) {
  }

  ngOnInit() {
    let user_id = this.cookieService.get('user_id');
    if (user_id !== '') { // user is login
      this.saveUserBehavior(this.item_id, user_id).then(() => {
        this.items = [];
        //------------------HB-----------------
        this.rsService.getHybridMethod(user_id, this.item_id).subscribe(items_rs => {
          this.getItemRecommended(items_rs).then(items => {
            for (let i = 0; i < items.length; i++) {
              let item = new Item();
              item.setItem(items[i]);
              this.items.push(item);
              this.itemService.getItem(items[i]._id).then(item => {
                if (item.image){
                  this.images.push(item.image);
                }
                else {
                  this.images.push('../../../assets/img/default-image.jpg');
                }
              });
            }
          });
        });
      });
    } else {
      //------------------CB-----------------
      this.items = [];
      this.rsService.getItemContentBased(this.item_id).subscribe(items_rs =>
        this.getItemRecommended(items_rs).then(items => {
          console.log(items.length)
          for (let i = 0; i < items.length; i++) {
            let item = new Item();
            item.setItem(items[i]);
            this.items.push(item);
            // this.images.push(this.getUrlImg(items[i]._id));
            // this.getUrlImg(items[i]._id).then(url => alert(url));
            this.itemService.getItem(items[i]._id).then(item => {
              if (item.image){
                this.images.push(item.image);
              }
              else {
                this.images.push('../../../assets/img/default-image.jpg');
              }
            });
          }
        })
      );
    }
    // this.saveUserBehavior(this.item_id, user_id).then(() => {
    //   this.items = [];
    //   this.rsService.getItemContentBased(this.item_id).subscribe(items_rs =>
    //     this.getItemRecommended(items_rs).then(items => {
    //       for (let i = 0; i < items.length; i++) {
    //         let item = new Item();
    //         item.setItem(items[i]);
    //         this.items.push(item);
    //         //this.images.push(items[i].image);
    //       }
    //     })
    //   );
    // });
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
    });
  }

  getUrlImg(id) {
    // alert(id);
    // this.itemService.getItem(id).then(item => {
    //   if (item.image){
    //     return item.image;
    //   }
    //   else if (item._attachments) {
    //     return 'http://localhost:5984/advertisement/' + item._id + '/image';
    //   }
    //   else {
    //     return  '../../../assets/img/default-image.jpg';
    //   }
    // });
    return new Promise((resolve, reject) => {
      let url = '';
      this.itemService.getItem(id).subscribe(item => {
        alert(item)
        if (item.image){
          url = item.image;
        }
        else if (item._attachments) {
          url = 'http://localhost:5984/advertisement/' + item._id + '/image';
        }
        else {
          url =  '../../../assets/img/default-image.jpg';
        }
      }).subscribe(() => {
        alert(url);
        resolve(url);
      });
    });
  }
}
