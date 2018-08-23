import {Component, OnInit} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {CategoryService} from "../../services/category.service";
import {SolrService} from "../../services/solr.service";
import {Item} from "../../item";

@Component({
  selector: 'app-search-ad',
  templateUrl: './search-ad.component.html',
  styleUrls: ['./search-ad.component.scss']
})
export class SearchAdComponent implements OnInit {
  sub_cat_name: string;
  keyword: string;
  total: number = 0;
  items = [];

  constructor(
    private route: ActivatedRoute,
    private catService: CategoryService,
    private solr: SolrService
  ) {
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.keyword = params.keyword;
      this.searchDocument(params.keyword, params.sub_cat_id, params.prov_id);
    });

    document.querySelector('body').classList.add('sidebar-lg-show');

    // let sidebarEl = document.getElementsByClassName("nav-dropdown");
    // for (let i = 0; i < sidebarEl.length; i++) {
    //   sidebarEl[i].classList.remove("open");
    //   console.log(sidebarEl[i])
    // }
    // console.log(sidebarEl)
  }

  searchDocument(keyword, sub_cat_id, prov_id) {
    this.items = [];
    return this.solr
      .search(keyword, sub_cat_id, prov_id)
      .subscribe(res => {
        Object.keys(res.response.docs).map(k => {
          let doc = res.response.docs[k];
          let item = new Item(doc.title[0], doc.content[0], doc.cat_id[0], doc.cat[0], doc.sub_cat_id[0],
            doc.sub_cat[0], doc.loc_id[0], doc.prov_id[0], doc.price[0], doc.couchdb_id[0]
          );
          this.sub_cat_name = doc.sub_cat[0];
          this.items.push(item);
        });
        this.total = this.items.length;
      });
  }

  // saveUserBehavior(item_id) {
  //   this.behavior.item = item_id;
  //   this.nodejs.post(this.behavior).subscribe(res => console.log(res));
  // }
}
