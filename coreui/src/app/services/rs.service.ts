import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: "root"
})
export class RsService {
  constructor(private http: HttpClient) {}

  getItemContentBased(item_id): Observable<any> {
    return this.http.get("http://localhost:3000/content-based/" + item_id);
  }

  getItemCollaborativeFiltering(user_id): Observable<any> {
    return this.http.get("http://localhost:3000/cf/" + user_id);
  }
}
