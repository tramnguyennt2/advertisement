import {Component, OnInit} from "@angular/core";
import {Item} from "../../item";
import {ItemService} from "../../services/item.service";
import {SolrService} from "../../services/solr.service";
import { ActivatedRoute } from "@angular/router";
import {User} from "../../user";
import {UserService} from "../../services/user.service";
import {Location} from '@angular/common';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: "app-post-ad",
  templateUrl: "./post-ad.component.html",
  styleUrls: ["./post-ad.component.scss"]
})
export class PostAdComponent implements OnInit {
  item = new Item();
  userId = '';
  user = new User();
  missingValue = false;
  url = null;

  constructor(private itemService: ItemService,
              private route: ActivatedRoute,
              private userService: UserService,
              private _location: Location,
              private cookieService: CookieService
  ) {}

  ngOnInit() {
    this.userId = this.cookieService.get('userId');
    this.userService.getUser(this.userId).then(res => {
      this.user.setUser(res);
    });
    let sidebarEl = document.getElementsByClassName("sidebar-lg-show");
    for (let i = 0; i < sidebarEl.length; i++) {
      sidebarEl[i].classList.remove("sidebar-lg-show");
    }
  }

  getLocationAndProvId(param) {
    this.item.loc_id = param.loc_id;
    this.item.loc = param.loc;
    this.item.prov_id = param.prov_id;
    this.item.prov = param.prov;
  }

  getCatAndSubCatId(param) {
    this.item.cat_id = param.cat_id;
    this.item.cat = param.cat;
    this.item.sub_cat_id = param.sub_cat_id;
    this.item.sub_cat = param.sub_cat;
  }

  handleAddNewItem() {
    if(!this.item.loc_id || !this.item.prov_id || !this.item.title || !this.item.price || !this.item.content){
      this.missingValue = true;
      return false;
    } else{
      this.missingValue = false;
      this.item.price = this.item.price.replace(/,/g,'');
      //insert to couchdb and solr
      let a = this.itemService.addItem(this.item);
    }
  }

  keyupPrice(){
    var price = this.item.price.replace(/[^0-9]/g,'');
    var arr = [];
    while(price.length > 3){
      arr.push(price.slice(-3));
      price = price.slice(0,price.length-3);
    }
    arr.push(price);
    var newPrice = '';
    arr.map(str => {
      newPrice = ',' + str + newPrice;
    });
    this.item.price = newPrice.slice(1);
  }

  cancel() {
    this._location.back();
  }

  readUrl(e) {
    if (e.target.files && e.target.files[0]) {
      var reader = new FileReader();

      reader.onload = (e: ProgressEvent) => {
        this.url = (<FileReader>e.target).result;
      }

      reader.readAsDataURL(e.target.files[0]);
    }
  }
}
