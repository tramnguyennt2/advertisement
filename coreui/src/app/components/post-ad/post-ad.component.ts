import {Component, OnInit} from "@angular/core";
import {Item} from "../../item";
import {ItemService} from "../../services/item.service";
import {PouchdbService} from "../../services/pouchdb.service";
import {Router} from "@angular/router";
import {ActivatedRoute} from "@angular/router";
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
  missingValue = false;
  url = null;

  constructor(
    private itemService: ItemService,
    private router: Router,
    private pouchdb: PouchdbService, private _location: Location,
    private userService: UserService, private route: ActivatedRoute,private cookieService: CookieService){}


  ngOnInit() {
    this.item.user_id = this.cookieService.get('user_id');
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
    if (!this.item.loc_id || !this.item.prov_id || !this.item.title || !this.item.price || !this.item.content) {
      this.missingValue = true;
      return false;
    } else {
      this.missingValue = false;
      this.item.price = this.item.price.replace(/,/g, '');
      // insert to couchdb and solr
      this.itemService.addItem(this.item).then(item => {
        this.router.navigateByUrl("/item-detail?id=" + item.id);
      });
    }
  }

  keyupPrice() {
    let price = this.item.price.replace(/[^0-9]/g, '');
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
    this.item.price = newPrice.slice(1);
  }

  cancel() {
    this._location.back();
  }

  onUploadFile(event) {
    // if (event.target.files && event.target.files.length > 0) {
    //   let file = event.target.files[0];
    //   let attachment = {};
    //   getBase64(file)
    //     .then(base64 => {
    //       attachment[file.name] = {
    //         content_type: file.type,
    //         data: base64
    //       };
    //     })
    //     .then(() => {
    //       if (!isEmpty(attachment)) {
    //         console.log("attachment", attachment);
    //         this.pouchdb.db
    //           .put({
    //             _id: "mydoccc",
    //             _attachments: attachment
    //           })
    //           .then(() => {
    //             return this.pouchdb.db.getAttachment("mydoccc", "ha.png");
    //           })
    //           .then(blob => {
    //             var url = URL.createObjectURL(blob);
    //             var img = document.createElement("img");
    //             img.src = url;
    //             document.body.appendChild(img);
    //           })
    //           .catch(function(err) {
    //             console.log(err);
    //           });
    //       } else {
    //         console.log("attachment is null");
    //       }
    //     })
    //     .catch(err => console.log("Error: ", err));
    // }
  }
}

function getBase64(file) {
  return new Promise(function (resolve, reject) {
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
      console.log(typeof reader.result);
      resolve(reader.result.replace(/^data:image\/(png|jpg);base64,/, ""));
    };
    reader.onerror = function (error) {
      reject(error);
    };
  });
}

function isEmpty(obj) {
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) return false;
  }
  return true;
}
