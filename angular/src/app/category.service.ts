import {Injectable} from '@angular/core';
import {Subject} from "rxjs/Subject";
import {PouchdbService} from "./pouchdb.service";

@Injectable()
export class CategoryService {
  catSubject: any = new Subject();
  cats: any;

  constructor(private pouchdb: PouchdbService) {
  }

  getAllCategory() {
    this.pouchdb.db.query('categories/all-category').then((data) => {
      let cats = data.rows.map(row => {
        return row.value;
      });
      this.cats = cats;
      console.log(this.cats[0]);
      this.catSubject.next(cats[0]);
    });
    return this.catSubject;
  }
}
