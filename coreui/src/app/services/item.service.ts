import { Injectable } from "@angular/core";
import { Subject } from "rxjs/Subject";
import { PouchdbService } from "./pouchdb.service";
import { Item } from "../item";
import { SolrService } from "./solr.service";

@Injectable()
export class ItemService {
  constructor(private pouchdb: PouchdbService, private solr: SolrService) {}

  // add to both CouchDB and Solr
  addItem(item) {
    let self = this;
    this.pouchdb.db.post(item, function(err, response) {
      if (err) {
        return console.log(err);
      }
      console.log("inserted to couchdb");
      let solr_item = Object.assign({}, item);
      solr_item.couchdb_id = response.id;
      self.solr
        .add(solr_item)
        .subscribe(res => console.log("inserted to solr"));
    });
  }

  // add to CouchDB
  add(item) {
    this.pouchdb.db.post(item, function(err, response) {
      if (err) {
        return console.log(err);
      }
    });
  }

  getItem(id): Promise<Item> {
    return this.pouchdb.db.get(id);
  }

  getLastestItems() {
    let latestItemsSubject: any = new Subject();
    let latestItems: Item[];
    // http://127.0.0.1:5984/advertisement/_design/items/_view/latest-items?limit=2&include_docs=true&descending=true
    this.pouchdb.db
      .query("items/latest-items", {
        limit: 5,
        include_docs: true,
        descending: true
      })
      .then(data => {
        latestItems = data.rows.map(row => {
          return new Item(
            row.doc.title,
            row.doc.content,
            row.doc.cat_id,
            row.doc.cat,
            row.doc.sub_cat_id,
            row.doc.sub_cat,
            row.doc.loc_id,
            row.doc.loc,
            row.doc.prov_id,
            row.doc.prov,
            row.doc.price,
            row.doc._id
          );
        });
        latestItemsSubject.next(latestItems);
      });
    return latestItemsSubject;
  }
}
