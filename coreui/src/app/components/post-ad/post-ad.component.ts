import { Component, OnInit } from "@angular/core";
import { Item } from "../../item";
import { ItemService } from "../../services/item.service";
import { PouchdbService } from "../../services/pouchdb.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-post-ad",
  templateUrl: "./post-ad.component.html",
  styleUrls: ["./post-ad.component.scss"]
})
export class PostAdComponent implements OnInit {
  item = new Item();

  constructor(
    private itemService: ItemService,
    private router: Router,
    private pouchdb: PouchdbService
  ) {}

  ngOnInit() {
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
    //insert to couchdb and solr
    this.itemService.addItem(this.item).then(item => {
      this.router.navigateByUrl("/item-detail?id=" + item.id);
    });
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
  return new Promise(function(resolve, reject) {
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function() {
      console.log(typeof reader.result);
      resolve(reader.result.replace(/^data:image\/(png|jpg);base64,/, ""));
    };
    reader.onerror = function(error) {
      reject(error);
    };
  });
}

function isEmpty(obj) {
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) return false;
  }
  return true;
}
