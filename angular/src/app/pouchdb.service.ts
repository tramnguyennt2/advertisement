import {Injectable} from '@angular/core';
import * as $PouchDB from 'pouchdb';
import 'rxjs/add/observable/from';
import {SolrService} from "./solr.service";
import {Ad} from "./ad";
import {Observable} from "rxjs/Observable";

const PouchDB = $PouchDB['default'];

@Injectable()
export class PouchdbService {
  db: any;
  remote = 'http://127.0.0.1:5984/advertisement';

  constructor(private solr: SolrService) {
    this.db = new PouchDB('advertisement');

    let options = {
      live: true,
      retry: true
    };

    this.db.sync(this.remote, options);
  }

  // add to both CouchDB and Solr
  addAd(item) {
    let self = this;
    this.db.post(item, function (err, response) {
      if (err) {
        return console.log(err);
      }
      let solr_item = new Ad(item.title, item.content, item.area, item.category, item.price, response.id);
      self.solr.add(solr_item).subscribe((res) => console.log('inserted to solr'));
    });
  }

  // add to CouchDB
  add(item) {
    this.db.post(item, function (err, response) {
      if (err) {
        return console.log(err);
      }
    });
  }

  get(id): Promise<Ad> {
    return this.db.get(id);
  }
}
