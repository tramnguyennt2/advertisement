import {Injectable} from '@angular/core';
import {Subject} from "rxjs/Subject";
import {PouchdbService} from "./pouchdb.service";
import {Ad} from "./ad";
import {SolrService} from "./solr.service";

@Injectable()
export class ItemService {
  catSubject: any = new Subject();
  cats: any;

  constructor(private pouchdb: PouchdbService, private solr: SolrService) {
  }

  // add to both CouchDB and Solr
  addItem(item) {
    let self = this;
    this.pouchdb.db.post(item, function (err, response) {
      if (err) {
        return console.log(err);
      }
      let solr_item = new Ad(item.title, item.content, item.area, item.category, item.price, response.id);
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

  getItem(id): Promise<Ad> {
    return this.pouchdb.db.get(id);
  }
}
