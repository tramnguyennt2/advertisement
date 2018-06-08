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
        let id = doc.id[0];
        let title = doc.title[0];
        let area = doc.area[0];
        let content = doc.content[0];
        let price = doc.price[0];
        this.items.push({
          'id': id,
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
    this.pouchdb.add(this.behavior);
  }
}
