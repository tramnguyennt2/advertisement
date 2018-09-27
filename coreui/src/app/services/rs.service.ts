import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: "root"
})
export class RsService {
  constructor(private http: HttpClient) {
  }
  nodeServer = "http://localhost:3000/";
  getItemContentBased(item_id): Observable<any> {
    return this.http.get(this.nodeServer + "content-based/" + item_id);
  }

  getItemCollaborativeFiltering(user_id): Observable<any> {
    return this.http.get(this.nodeServer + "cf/" + user_id);
  }

  getHybridMethod(item_id, user_id): Observable<any> {
    return this.http.get(this.nodeServer + "hybrid/" + user_id + '/' + item_id);
  }

  getGraphMethod(user_id): Observable<any> {
    return this.http.get(this.nodeServer + "graph/" + user_id);
  }
}
