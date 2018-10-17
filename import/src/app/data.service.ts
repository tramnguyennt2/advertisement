import {Injectable} from '@angular/core';
import * as $PouchDB from 'pouchdb';
import 'rxjs/add/observable/from';

const PouchDB = $PouchDB['default'];

@Injectable()
export class DataService {
  db: any;
  remote = 'http://localhost:5984/ads';
  constructor() {
    this.db = new PouchDB('ads');

    let options = {
      live: true,
      retry: true
    };

    this.db.sync(this.remote, options);
  }

  addAds(ads): void {
    this.db.post(ads);
  }
}
