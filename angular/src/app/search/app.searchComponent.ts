import {Component} from '@angular/core';
import {UserBehavior} from '../user-behavior';
import {HttpClient} from '@angular/common/http';
import {PouchdbService} from '../pouchdb.service';
import {SolrService} from '../solr.service';

@Component({
  selector: 'search',
  templateUrl: './search.html',
  styleUrls: ['./search.css']
})
export class searchComponent {
  keyword = '';
  items = [];
  behavior = new UserBehavior(1);
  area = '';
  cat = '';

  constructor(private http: HttpClient, private pouchdb: PouchdbService, private solr: SolrService) {
  }

  searchDocument() {
    this.items = [];
    return this.solr.search(this.keyword, this.area, this.cat).subscribe((res) => {
      Object.keys(res.response.docs).map(k => {
        let doc = res.response.docs[k];
        let title = doc.title[0];
        let content = doc.description[0];
        let price = doc.price[0];
        this.items.push({
          'title': title,
          'content': content,
          'price': price
        });
      });
    });
  }

  saveUserBehavior(item_id) {
    this.behavior.item = item_id;
    this.pouchdb.add(this.behavior);
  }
}
