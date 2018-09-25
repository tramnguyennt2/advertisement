import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { SolrService } from "../../services/solr.service";
import { Item } from "../../item";

@Component({
  selector: "app-search-ad",
  templateUrl: "./search-ad.component.html",
  styleUrls: ["./search-ad.component.scss"]
})
export class SearchAdComponent implements OnInit {
  keyword: string;
  sub_cat_id: string;
  prov_id: string;
  total: number = 0;
  items = [];

  constructor(private route: ActivatedRoute, private solr: SolrService) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.keyword = params.keyword;
      this.sub_cat_id = params.sub_cat_id;
      this.prov_id = params.prov_id;
      this.searchDocument(params.keyword, params.sub_cat_id, params.prov_id);
    });

    document.querySelector("body").classList.add("sidebar-lg-show");
  }

  searchDocument(
    keyword,
    sub_cat_id,
    prov_id,
    sort_field = undefined,
    sort = undefined
  ) {
    this.items = [];
    return this.solr
      .search(keyword, sub_cat_id, prov_id, sort_field, sort)
      .subscribe(res => {
        Object.keys(res.response.docs).map(k => {
          let doc = res.response.docs[k];
          let item = new Item(
            doc.title[0],
            doc.content[0],
            null,
            null,
            doc.sub_cat_id[0],
            null,
            null,
            null,
            doc.prov_id[0],
            null,
            doc.price,
            null,
            doc.db_id
          );
          this.items.push(item);
        });
        this.total = this.items.length;
      });
  }

  onFilterChange(event) {
    let sort = event.target.value;
    if (sort === "oldest") {
      this.searchDocument(
        this.keyword,
        this.sub_cat_id,
        this.prov_id,
        "created_at",
        "asc"
      );
    }
    if (sort === "newest") {
      this.searchDocument(this.keyword, this.sub_cat_id, this.prov_id);
    }
    if (sort === "lowest") {
      this.searchDocument(
        this.keyword,
        this.sub_cat_id,
        this.prov_id,
        "price",
        "asc"
      );
    }
    if (sort === "highest") {
      this.searchDocument(
        this.keyword,
        this.sub_cat_id,
        this.prov_id,
        "price",
        "desc"
      );
    }
  }
}
