import {Component} from '@angular/core';
import {UserBehavior} from "../user-behavior";
import {HttpClient} from "@angular/common/http";
import {PouchdbService} from "../pouchdb.service";
import {SolrService} from "../solr.service";

@Component({
  selector: 'search',
  templateUrl: './search.html',
  styleUrls: ['./search.css']
})
export class searchComponent {
  keyword = '';
  items = [];
  behavior = new UserBehavior(1);
  message = '';

  constructor(private http: HttpClient, private pouchdb: PouchdbService, private solr: SolrService) {
  }

  searchDocument() {
    this.items = [];
    return this.solr.search(this.keyword).subscribe((res) => {

    });
  }

  saveUserBehavior(item_id) {
    this.behavior.item = item_id;
    // this.pouchdb.add(this.behavior);
  }
}
