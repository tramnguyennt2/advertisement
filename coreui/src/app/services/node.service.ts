import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs/Observable";

@Injectable()
export class NodeService {
  constructor(private http: HttpClient) {}

  post(data): Observable<any> {
    let headers = new HttpHeaders();
    headers.append("Content-Type", "application/json");
    console.log(data);
    return this.http.post(
      "http://localhost:3000/get-token",
      { content: data },
      {
        headers: headers
      }
    );
  }
}
