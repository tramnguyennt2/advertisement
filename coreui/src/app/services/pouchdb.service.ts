import { Injectable } from "@angular/core";
import * as $PouchDB from "pouchdb";
import "rxjs/add/observable/from";
import { environment } from "../../environments/environment";
import findPlugin from "pouchdb-find";

const PouchDB = $PouchDB["default"];

@Injectable()
export class PouchdbService {
  db: any;
  remote = environment.couchdb_server + "/advertisement";

  constructor() {
    PouchDB.plugin(findPlugin);
    this.db = new PouchDB("advertisement");
    this.db.createIndex({
      index: { fields: ["type"] }
    });
    let options = {
      live: true,
      retry: true
    };

    this.db.sync(this.remote, options);
  }
}
