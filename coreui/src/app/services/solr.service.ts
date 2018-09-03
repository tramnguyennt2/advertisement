import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "../../environments/environment";

@Injectable()
export class SolrService {
  solr_url = environment.solr_server + "/advertisement";

  constructor(private http: HttpClient) {}

  add(ads) {
    let headers = new HttpHeaders();
    headers.append("Content-Type", "application/json");
    return this.http.post(
      this.solr_url + "/update/json/docs?commit=true",
      ads,
      {
        headers: headers
      }
    );
  }

  search(keyword, sub_cat_id, prov_id): any {
    // let url =
    //   this.solr_url + "/select?q=" + keyword + " AND sub_cat_id:" + sub_cat_id + " AND prov_id:" + prov_id + "&wt=json";
    let url = this.solr_url + "/select?q=";
    let after_keyword = "";
    let after_sub = "";
    if (keyword && keyword.length > 0) {
      url += keyword;
      after_keyword = " AND ";
    }
    if (sub_cat_id && sub_cat_id.length > 0) {
      url += after_keyword + "sub_cat_id:" + sub_cat_id;
      after_sub = " AND ";
    }
    if (prov_id && prov_id.length > 0) {
      if (after_sub.length > 0) url += after_sub + "prov_id:" + prov_id;
      else url += after_keyword + "prov_id:" + prov_id;
    }
    url += "&wt=json";
    return this.http.get(url);
  }

  getDetail(id): any {
    //return this.http.get(this.solr_url + '/select?q=id:' + id + '&fl=title,description&wt=json');
    return this.http.get(this.solr_url + "/select?q=id:" + id);
  }
}
