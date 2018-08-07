import {Component, OnInit} from '@angular/core';
import {PouchdbService} from "../../services/pouchdb.service";
import {SolrService} from "../../services/solr.service";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {UserBehavior} from "../user-behavior";
import 'rxjs/add/operator/map';
import {NodeService} from "../../services/node.service";

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  keyword = '';
  items = [];
  behavior = new UserBehavior(1);
  area = 'all';
  cat = 'all';

  constructor(private nodejs: NodeService, private pouchdb: PouchdbService, private solr: SolrService) {
  }

  ngOnInit() {
  }

  searchDocument() {
    this.items = [];
    return this.solr.search(this.keyword, this.area, this.cat).subscribe((res) => {
      Object.keys(res.response.docs).map(k => {
        let doc = res.response.docs[k];
        // let id = doc.id;
        let couchdb_id = doc.couchdb_id[0];
        let title = doc.title[0];
        let area = doc.area[0];
        let content = doc.content[0];
        let price = doc.price[0];
        this.items.push({
          // 'id': id,
          'couchdb_id': couchdb_id,
          'title': title,
          'area': area,
          'content': content,
          'price': price
        });
      });
    });
  }

  saveUserBehavior(item_id) {
    this.behavior.item = item_id;
    this.nodejs.post(this.behavior).subscribe(res => console.log(res));
  }
}
