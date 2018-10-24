import {Component, OnInit} from "@angular/core";
import {Item} from "../../item";
import {ItemService} from "../../services/item.service";
import {PouchdbService} from "../../services/pouchdb.service";
import {Router} from "@angular/router";
import {UserService} from "../../services/user.service";
import {Location} from '@angular/common';
import {CookieService} from 'ngx-cookie-service';
import {NodeService} from "../../services/node.service";
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: "app-post-ad",
  templateUrl: "./post-ad.component.html",
  styleUrls: ["./post-ad.component.scss"]
})

export class PostAdComponent implements OnInit {
  item = new Item();
  missingValue = false;
  url: string;

  constructor(
    private itemService: ItemService,
    private router: Router,
    private pouchdb: PouchdbService,
    private _location: Location,
    private userService: UserService,
    private cookieService: CookieService,
    private nodeService: NodeService,
    private spinner: NgxSpinnerService) {
  }


  ngOnInit() {
    this.spinner.show();
    setTimeout(() => {
      /** spinner ends after 5 seconds */
      this.spinner.hide();
    }, 1000);
    this.item.user_id = this.cookieService.get('user_id');
    let sidebarEl = document.getElementsByClassName("sidebar-lg-show");
    for (let i = 0; i < sidebarEl.length; i++) {
      sidebarEl[i].classList.remove("sidebar-lg-show");
    }
  }

  getLocationAndSubLocId(param) {
    this.item.loc_id = param.loc_id;
    this.item.loc = param.loc;
    this.item.sub_loc_id = param.sub_loc_id;
    this.item.sub_loc = param.sub_loc;
  }

  getCatAndSubCatId(param) {
    this.item.cat_id = param.cat_id;
    this.item.cat = param.cat;
    this.item.sub_cat_id = param.sub_cat_id;
    this.item.sub_cat = param.sub_cat;
  }

  handleAddNewItem() {
    let self = this;
    if (!this.item.loc_id || !this.item.sub_loc_id || !this.item.title || !this.item.price || !this.item.content) {
      this.missingValue = true;
      return false;
    } else {
      this.missingValue = false;
      this.item.price = this.item.price.replace(/,/g, '');
      // get token
      self.nodeService.post(self.item.content).subscribe((token) => {
        if (token) {
          console.log("token received:", token);
          self.item.token = token;
          // save to CouchDb and solr
          this.itemService.addItem(this.item).then(item => {
            this.router.navigateByUrl("/item-detail?id=" + item.id);
          });
        }
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

  onUploadFile(e) {
    if (e.target.files && e.target.files.length > 0) {
      let file = e.target.files[0];
      let attachment = {};

      //display img
      let reader = new FileReader();
      reader.onload = (e: ProgressEvent) => {
        this.url = (<FileReader>e.target).result;
      };
      reader.readAsDataURL(file);

      // add file to item
      getBase64(file)
        .then(base64 => {
          attachment['image'] = {
            content_type: file.type,
            data: base64
          };
        })
        .then(() => {
          if (!isEmpty(attachment)) {
            console.log("attachment", attachment);
            this.item._attachments = attachment;
          } else {
            console.log("attachment is null");
          }
        })
        .catch(err => console.log("Error: ", err));
    }
    console.log(this.item)
  }

  readUrl(e) {
    if (e.target.files && e.target.files[0]) {
      let reader = new FileReader();
      reader.onload = (e: ProgressEvent) => {
        this.url = (<FileReader>e.target).result;
      };
      reader.readAsDataURL(e.target.files[0]);
    }
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
