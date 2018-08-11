import {Injectable} from '@angular/core';
import * as $PouchDB from 'pouchdb';
import 'rxjs/add/observable/from';
import {environment} from '../../environments/environment';

const PouchDB = $PouchDB['default'];

@Injectable()
export class PouchdbService {
  db: any;
  remote = environment.couchdb_server + '/advertisement';

  constructor() {
    this.db = new PouchDB('advertisement');

    let options = {
      live: true,
      retry: true
    };

    this.db.sync(this.remote, options);
  }
}
