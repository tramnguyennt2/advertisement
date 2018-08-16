import { Injectable } from "@angular/core";
import { Subject } from "rxjs/Subject";
import { PouchdbService } from "./pouchdb.service";

@Injectable({
  providedIn: "root"
})
export class LocationService {
  locSubject: any = new Subject();

  constructor(private pouchdb: PouchdbService) {}

  getAllLocation() {
    this.pouchdb.db
      .find({
        selector: { type: "location" }
      })
      .then(result => {
        this.locSubject.next(result.docs[0].data);
      })
      .catch(function(err) {
        console.log(err);
      });
    return this.locSubject;
  }
}
