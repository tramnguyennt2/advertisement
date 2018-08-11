import { Injectable } from "@angular/core";
import { Subject } from "rxjs/Subject";
import { PouchdbService } from "./pouchdb.service";

@Injectable()
export class CategoryService {
  catSubject: any = new Subject();
  cats: any;

  subs: any;
  subSubject: any = new Subject();

  constructor(private pouchdb: PouchdbService) {}

  getAllCategory() {
    this.pouchdb.db.query("categories/all-category").then(data => {
      let cats = data.rows.map(row => {
        return row.value;
      });
      this.subs = cats;
      this.subSubject.next(cats[0]);
    });
    return this.subSubject;
  }

  getItemNumberOfCategory() {
    // http://127.0.0.1:5984/advertisement/_design/categories/_view/numberItems?group=true
    this.pouchdb.db
      .query("categories/numberItems", { group: true })
      .then(data => {
        let cats = data.rows.map(row => {
          return row;
        });
        this.cats = cats;
        this.catSubject.next(cats);
      });
    return this.catSubject;
  }
}
