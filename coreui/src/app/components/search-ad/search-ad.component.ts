import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { SolrService } from "../../services/solr.service";
import { Item } from "../../item";
import { UserBehavior } from "../../user-behavior";

@Component({
  selector: "app-search-ad",
  templateUrl: "./search-ad.component.html",
  styleUrls: ["./search-ad.component.scss"]
})
export class SearchAdComponent implements OnInit {
  keyword: string;
  total: number = 0;
  items = [];
  rating: UserBehavior;

  constructor(private route: ActivatedRoute, private solr: SolrService) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.keyword = params.keyword;
      this.searchDocument(params.keyword, params.sub_cat_id, params.prov_id);
    });

    document.querySelector("body").classList.add("sidebar-lg-show");
  }

  searchDocument(keyword, sub_cat_id, prov_id) {
    this.items = [];
    return this.solr.search(keyword, sub_cat_id, prov_id).subscribe(res => {
      Object.keys(res.response.docs).map(k => {
        let doc = res.response.docs[k];
        let item = new Item(
          doc.title[0],
          doc.content[0],
          doc.cat_id[0],
          doc.cat[0],
          doc.sub_cat_id[0],
          doc.sub_cat[0],
          doc.loc_id[0],
          doc.loc[0],
          doc.prov_id[0],
          doc.prov[0],
          doc.price[0],
          doc.couchdb_id[0]
        );
        this.items.push(item);
      });
      this.total = this.items.length;
    });
  }

  saveUserBehavior(item_id) {
    this.rating.item = item_id;
    // this.nodejs.post(this.behavior).subscribe(res => console.log(res));
  }
}
