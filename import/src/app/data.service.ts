import {Injectable} from "@angular/core";
import * as $PouchDB from "pouchdb";
import "rxjs/add/observable/from";
import findPlugin from "pouchdb-find";

const PouchDB = $PouchDB["default"];


@Injectable()
export class DataService {
    db: any;
    remote = "http://localhost:5984/advertisement";

    constructor() {
        PouchDB.plugin(findPlugin);
        this.db = new PouchDB("advertisement");

        let options = {
            live: true,
            retry: true
        };

        this.db.sync(this.remote, options);
    }

    addAds(ads) {
        this.db.post(ads);
    }

    getDoc(id: string) {
        return this.db.get(id);
    }

    deleteDoc(id: string) {
        let self = this;
        this.getDoc(id).then(function (res) {
            return self.db.remove(res, function (err) {
                if (err) {
                    return console.log(err);
                } else {
                    console.log("Deleted", id);
                }
            });
        });
    }

}
