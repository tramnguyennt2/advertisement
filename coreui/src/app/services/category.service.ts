import { Injectable } from "@angular/core";
import { Subject } from "rxjs/Subject";
import { PouchdbService } from "./pouchdb.service";
import "rxjs/add/operator/map";

@Injectable()
export class CategoryService {
  catSubject: any = new Subject();
  cats: any;

  allCategorySubject: any = new Subject();

  constructor(private pouchdb: PouchdbService) {}

  getAllCategory() {
    this.pouchdb.db
      .find({
        selector: { type: "category" }
      })
      .then(result => {
        this.allCategorySubject.next(result.docs[0].data);
      })
      .catch(function(err) {
        console.log(err);
      });
    return this.allCategorySubject;
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

  getCategory(id: string) {
    return this.getAllCategory().map(cats => {
      for (let i = 0; i < cats.length; i++) {
        if (cats[i].cat_id == id) {
          return cats[i].cat_name;
        }
      }
    });
  }
}
