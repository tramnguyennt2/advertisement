import {Component, OnInit} from '@angular/core';
import {PouchdbService} from "../services/pouchdb.service";
import {SolrService} from "../services/solr.service";
import {UserBehavior} from "../user-behavior";
import 'rxjs/add/operator/map';
import {NodeService} from "../services/node.service";
import {ActivatedRoute} from "@angular/router";
import {Item} from "../item";

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  keyword: string;
  cat: string;
  location: string;
  items: Item[];
  len: number;
  behavior = new UserBehavior(1);
  cats = [];

  constructor(private nodejs: NodeService, private pouchdb: PouchdbService,
              private solr: SolrService, private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.route.queryParams
      .subscribe(params => {
        this.keyword = params.keyword;
        this.cat = params.cat;
        this.location = params.location;
      });
  }

  searchDocument() {
    this.items = [];
    return this.solr.search(this.keyword, this.location, this.cat).subscribe((res) => {
      Object.keys(res.response.docs).map(k => {
        let doc = res.response.docs[k];
        let item = new Item(doc.title[0], doc.content[0], doc.area[0], "", doc.price[0]);
        this.items.push(item);
      });
      this.len = this.items.length;
    });
  }

  saveUserBehavior(item_id) {
    this.behavior.item = item_id;
    this.nodejs.post(this.behavior).subscribe(res => console.log(res));
  }
}
