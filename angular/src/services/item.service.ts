import {Injectable} from '@angular/core';
import {PouchdbService} from "./pouchdb.service";
import {Item} from "../app/item";
import {SolrService} from "./solr.service";
import {Subject} from "rxjs/Subject";

@Injectable()
export class ItemService {
  latestItemsSubject: any = new Subject();
  constructor(private pouchdb: PouchdbService, private solr: SolrService) {
  }

  // add to both CouchDB and Solr
  addItem(item) {
    let self = this;
    this.pouchdb.db.post(item, function (err, response) {
      if (err) {
        return console.log(err);
      }
      let solr_item = new Item(item.title, item.content, item.area, item.category, item.price, response.id);
      self.solr.add(solr_item).subscribe((res) => console.log('inserted to solr'));
    });
  }

  // add to CouchDB
  add(item) {
    this.pouchdb.db.post(item, function (err, response) {
      if (err) {
        return console.log(err);
      }
    });
  }

  getItem(id): Promise<Item> {
    return this.pouchdb.db.get(id);
  }

  getLastestItems() {
    let latestItems: Item[];
    // http://127.0.0.1:5984/advertisement/_design/items/_view/latest-items?limit=2&include_docs=true&descending=true
    this.pouchdb.db.query('items/latest-items', {
      limit: 5,
      include_docs: true,
      descending: true
    }).then((data) => {
      latestItems = data.rows.map(row => {
        return new Item(row.doc.title, row.doc.content, row.doc.area,
          row.doc.category, row.doc.price);
      });
      this.latestItemsSubject.next(latestItems);
    });
    return this.latestItemsSubject;
  }
}
