import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { CategoryService } from "../../services/category.service";
import { SolrService } from "../../services/solr.service";
import { Item } from "../../item";

@Component({
  selector: "app-search",
  templateUrl: "./search.component.html",
  styleUrls: ["./search.component.scss"]
})
export class SearchComponent implements OnInit {
  keyword: string;
  cat_name: string;
  loc_id: string;
  cat_id: string;
  total: number = 0;
  items = [];

  constructor(
    private route: ActivatedRoute,
    private catService: CategoryService,
    private solr: SolrService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.keyword = params.keyword;
      this.cat_id = params.cat;
      this.catService.getCategory(this.cat_id).subscribe(cat_name => {
        this.cat_name = cat_name;
      });
      this.loc_id = params.loc;
      // this.searchDocument();
    });
  }

  // searchDocument() {
  //   this.items = [];
  //   return this.solr
  //     .search(this.keyword, this.loc_id, this.cat_id)
  //     .subscribe(res => {
  //       Object.keys(res.response.docs).map(k => {
  //         let doc = res.response.docs[k];
  //         let item = new Item(
  //           doc.title[0],
  //           doc.content[0],
  //           doc.area[0],
  //           doc.category[0],
  //           doc.price[0]
  //         );
  //         this.items.push(item);
  //       });
  //       this.total = this.items.length;
  //     });
  // }

  // saveUserBehavior(item_id) {
  //   this.behavior.item = item_id;
  //   this.nodejs.post(this.behavior).subscribe(res => console.log(res));
  // }
}
