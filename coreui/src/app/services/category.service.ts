import {Injectable} from "@angular/core";
import {Subject} from "rxjs/Subject";
import {PouchdbService} from "./pouchdb.service";
import "rxjs/add/operator/map";

@Injectable()
export class CategoryService {
  constructor(private pouchdb: PouchdbService) {
  }

  getAllCategory() {
    let allCategorySubject: any = new Subject();
    this.pouchdb.db
      .find({
        selector: {type: "category"}
      })
      .then(result => {
        allCategorySubject.next(result.docs[0].data);
      })
      .catch(function (err) {
        console.log(err);
      });
    return allCategorySubject;
  }

  getItemNumberOfCategory() {
    let catSubject: any = new Subject();
    let cats: any;
    // http://127.0.0.1:5984/advertisement/_design/categories/_view/numberItems?group=true
    this.pouchdb.db
      .query("categories/numberItems", {group: true})
      .then(data => {
        cats = data.rows.map(row => {
          return row;
        });
        catSubject.next(cats);
      });
    return catSubject;
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
