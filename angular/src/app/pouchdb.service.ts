import {Injectable} from '@angular/core';
import * as $PouchDB from 'pouchdb';
import 'rxjs/add/observable/from';

const PouchDB = $PouchDB['default'];

@Injectable()
export class PouchdbService {
  db: any;
  remote = 'http://127.0.0.1:5984/advertisement';

  constructor() {
    this.db = new PouchDB('advertisement');

    let options = {
      live: true,
      retry: true
    };

    this.db.sync(this.remote, options);
  }

  add(item): void {
    this.db.post(item, function (err, response) {
      if (err) {
        return console.log(err);
      }
      return response.id;
    });
  }
}
