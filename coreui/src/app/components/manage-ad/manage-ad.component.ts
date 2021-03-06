import { Component, OnInit } from "@angular/core";
import { ItemService } from "../../services/item.service";
import { Item } from "../../item";
import { UserService } from "../../services/user.service";
import { CookieService } from "ngx-cookie-service";
import { SolrService } from "../../services/solr.service";
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: "app-manage-ad",
  templateUrl: "./manage-ad.component.html",
  styleUrls: ["./manage-ad.component.scss"]
})
export class ManageAdComponent implements OnInit {
  items: Item[];
  userId: string;

  constructor(
    private cookieService: CookieService,
    private itemService: ItemService,
    private userService: UserService,
    private solr: SolrService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit() {
    this.spinner.show();
    setTimeout(() => {
      /** spinner ends after 5 seconds */
      this.spinner.hide();
    }, 5000);
    let sidebarEl = document.getElementsByClassName("sidebar-lg-show");
    for (let i = 0; i < sidebarEl.length; i++) {
      sidebarEl[i].classList.remove("sidebar-lg-show");
    }
    this.userId = this.cookieService.get("user_id");
    this.itemService.getItemByUser(this.userId).subscribe(res => {
      this.items = res;
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

  onClickUpdate(id) {
    window.open("update-ad?id=" + id, "_blank");
  }

  deleteItem(id) {
    this.solr.delete(id).subscribe(res => console.log("solr res", res));
    this.itemService.delete(id);
  }

  getViewNumber(id) {
    let viewNumber = 0;
    this.itemService.getRatingByItem(id).subscribe(res => {
      res.map(rating => {
        viewNumber += rating.rating;
        console.log(viewNumber);
      });
    });
    return viewNumber;
  }

  reload() {
    window.location.reload();
  }
}
