import {Component, OnInit} from '@angular/core';
import {ItemService} from "../../services/item.service";
import {Item} from "../../item";
import {CookieService} from "ngx-cookie-service";
import {UserService} from "../../services/user.service";
import {NgxSpinnerService} from 'ngx-spinner';
import {PouchdbService} from "../../services/pouchdb.service";
import {SolrService} from "../../services/solr.service";

@Component({
  selector: 'app-manage-ad',
  templateUrl: './manage-ad.component.html',
  styleUrls: ['./manage-ad.component.scss']
})
export class ManageAdComponent implements OnInit {
  items = [];
  userId: string;
  chooseId;

  constructor(
    private cookieService: CookieService,
    private itemService: ItemService,
    private userService: UserService,
    private solr: SolrService,
    private pouchdb: PouchdbService,
    private spinner: NgxSpinnerService
  ) {
  }

  ngOnInit() {
    // this.spinner.show();
    let sidebarEl = document.getElementsByClassName("sidebar-lg-show");
    for (let i = 0; i < sidebarEl.length; i++) {
      sidebarEl[i].classList.remove("sidebar-lg-show");
    }
    this.userId = this.cookieService.get('user_id');
    this.itemService.getItemByUser(this.userId).subscribe(res => {
      res.forEach(d => {
        let itemObj = new Item();
        itemObj.setItem(d);
        this.items.push(itemObj);
      });
      // this.spinner.hide();
    });
  }

  formatPrice(price) {
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

  updateChooseId(id) {
    this.chooseId = id;
  }

  onClickUpdate(id) {
    window.open("update-ad?id=" + id, "_blank");
  }

  deleteItem() {
    console.log("id", this.chooseId);
    // delete in solr - work!!!
    // this.solr.delete(this.chooseId).subscribe(res => console.log("solr res", res));

    // delete in couchdb
    // this.itemService.deleteI(this.chooseId).then(res => console.log("x res", res));
  }

  getViewNumber(id) {
    let viewNumber = 0;
    this.itemService.getRatingByItem(id).subscribe(res => {
      res.map(rating => {
        viewNumber += rating.rating;
        console.log(viewNumber)
      });

    });
    return viewNumber;
  }

  getUserView(id) {
    let users = [];
    this.itemService.getRatingByItem(id).subscribe(res => {
      res.map(rating => {
        this.userService.getUser(rating.user_id).then(user => {
          users.push(user)
        })
      });
      console.log(users)
    });
  }
}
