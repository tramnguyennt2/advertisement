import { Injectable } from "@angular/core";
import { Subject } from "rxjs/Subject";
import { PouchdbService } from "./pouchdb.service";

@Injectable({
  providedIn: "root"
})
export class LocationService {
  constructor(private pouchdb: PouchdbService) {}

  getAllLocation() {
    let locSubject: any = new Subject();
    this.pouchdb.db
      .find({
        selector: { type: "location" }
      })
      .then(result => {
        locSubject.next(result.docs[0].data);
      })
      .catch(function(err) {
        console.log(err);
      });
    return locSubject;
  }
}
