import {Injectable} from "@angular/core";
import {Subject} from "rxjs/Subject";
import {PouchdbService} from "./pouchdb.service";
import "rxjs/add/observable/fromPromise";

@Injectable()
export class UserService {
  constructor(private pouchdb: PouchdbService) {
  }

  // add to CouchDB
  add(user) {
    this.pouchdb.db.post(user, function (err, response) {
      console.log("add resp: ", response);
      if (err) {
        return console.log(err);
      }
      console.log("inserted user to couchdb");
    });
  }

  getUser(id: string) {
    return this.pouchdb.db.get(id);
  }

  loginUser(email: string, password: string) {
    let userSubject: any = new Subject();
    this.pouchdb.db
      .find({
        selector: {
          type: 'user',
          email: email,
          password: password
        }
      })
      .then(result => {
        if (result.docs.length > 0) {
          userSubject.next(result.docs[0]);
        } else {
          userSubject.next(null);
        }
      })
      .catch(function (err) {
        console.log(err);
      });
    return userSubject;
  }

  checkEmail(email: string) {
    let userSubject: any = new Subject();
    this.pouchdb.db
      .find({
        selector: {
          type: 'user',
          email: email
        }
      })
      .then(result => {
        if (result.docs.length > 0) userSubject.next(result.docs[0]);
        else userSubject.next(null);
      })
      .catch(function (err) {
        console.log(err);
      });
    return userSubject;
  }
}
