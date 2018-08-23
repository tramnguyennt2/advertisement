import {Component, OnInit} from "@angular/core";
import {Item} from "../../item";
import {ItemService} from "../../services/item.service";
import {SolrService} from "../../services/solr.service";

@Component({
  selector: "app-post-ad",
  templateUrl: "./post-ad.component.html",
  styleUrls: ["./post-ad.component.scss"]
})
export class PostAdComponent implements OnInit {
  item = new Item();

  constructor(private itemService: ItemService, private solr: SolrService) {
  }

  ngOnInit() {
  }

  getLocationAndProvId(param) {
    this.item.loc_id = param.loc_id;
    this.item.prov_id = param.prov_id;
  }

  getCatAndSubCatId(param) {
    this.item.cat_id = param.cat_id;
    this.item.cat = param.cat;
    this.item.sub_cat_id = param.sub_cat_id;
    this.item.sub_cat = param.sub_cat;
  }

  handleAddNewItem() {
    //insert to couchdb and solr
    let a = this.itemService.addItem(this.item);
  }
}
