import {Injectable} from "@angular/core";
import {Subject} from "rxjs/Subject";
import {PouchdbService} from "./pouchdb.service";
import {Item} from "../item";
import {SolrService} from "./solr.service";
import "rxjs/add/observable/fromPromise";
import {UserBehavior} from "../user-behavior";

@Injectable()
export class ItemService {
  constructor(private pouchdb: PouchdbService, private solr: SolrService, ) {
  }

  // add to both CouchDB and Solr
  addItem(item) {
    let self = this;
    return this.pouchdb.db.post(item, function (err, response) {
      if (err) return console.log(err);
      console.log("inserted to couchdb");
      let solr_item = new Item(item.title, item.content, null, null, item.sub_cat_id,
        null, null, null, item.prov_id, null, item.price);
      solr_item.addDbId(response.id);
      self.solr.add(solr_item).subscribe(res => console.log("inserted to solr"));
    });
  }

  // add to CouchDB
  add(item) {
    this.pouchdb.db.post(item, function (err, response) {
      if (err) return console.log(err);
    });
  }

  getItem(id: string) {
    return this.pouchdb.db.get(id);
  }

  getItemOfRating(rating: UserBehavior) {
    let ratingSubject: any = new Subject();
    this.pouchdb.db
      .find({
        selector: {
          type: rating.type,
          item_id: rating.item_id,
          user_id: rating.user_id
        }
      })
      .then(result => {
        if (result.docs.length > 0) {
          ratingSubject.next(result.docs[0]);
        } else {
          ratingSubject.next(null);
        }
      })
      .catch(function (err) {
        console.log(err);
      });
    return ratingSubject;
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
          return new Item(row.doc.title, row.doc.content, row.doc.cat_id, row.doc.cat, row.doc.sub_cat_id,
            row.doc.sub_cat, row.doc.loc_id, row.doc.loc, row.doc.prov_id, row.doc.prov, row.doc.price,
            row.doc.user_id, row.doc._id, row.doc._attachments);
        });
        latestItemsSubject.next(latestItems);
      });
    return latestItemsSubject;
  }

  updateRating(rating) {
    if (rating.rating < 5) {
      this.pouchdb.db.put({
        _id: rating._id, _rev: rating._rev, user_id: rating.user_id, item_id: rating.item_id,
        rating: rating.rating + 1, type: "rating"
      }).then(function (response) {
        console.log("update resp: ", response);
      }).catch(function (err) {
        console.log(err);
      });
    }
  }

  getItemByUser(userId){
    let itemSubject: any = new Subject();
    let items: any[];
    this.pouchdb.db
      .find({
        selector: {
          type: 'item',
          user_id: userId
        }
      })
      .then(data => {
        items = data.docs.map(row => {
          return row;
        });
        itemSubject.next(items);
      });
    return itemSubject;
  }

  delete(id) {
    let self = this;
    this.getItem(id).then(function (res) {
      return self.pouchdb.db.remove(res, function (err) {
        if (err) {
          return console.log(err);
        } else {
          console.log("Deleted item successfully");
        }
      });
    });
  }
}
