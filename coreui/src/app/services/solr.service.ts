import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "../../environments/environment";

@Injectable()
export class SolrService {
  solr_url = environment.solr_server + "/item";

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

  delete(dbId) {
    let headers = new HttpHeaders();
    headers.append("Content-Type", "application/json");
    let query = "db_id:" + dbId;
    return this.http.post(
      this.solr_url + "/update/json?commit=true",
      { delete: { query: query } },
      {
        headers: headers
      }
    );
  }

  search(
    keyword,
    sub_cat_id,
    sub_loc_id,
    sort_field = undefined,
    sort = undefined
  ): any {
    // let url =
    // this.solr_url + "/select?q=" + keyword + " and sub_cat_id:" + sub_cat_id + " and sub_loc_id:" + sub_loc_id + "&wt=json";
    let url = this.solr_url + "/select?q=content:" + keyword + " and title:";
    if (keyword && keyword.length > 0) {
      url += keyword;
    }
    if (sub_cat_id && sub_cat_id.length > 0) {
      url += "&fq=sub_cat_id:" + sub_cat_id;
    }
    if (sub_loc_id && sub_loc_id.length > 0) {
      url += "&fq=sub_loc_id:" + sub_loc_id;
    }
    if (!keyword && !sub_cat_id && !sub_loc_id) url += "*:*";
    url += "&rows=3000";
    if (sort_field && sort) {
      url += "&sort=" + sort_field + " " + sort;
    } else {
      // newest default
      url += "&sort=created_at desc&wt=json";
    }
    return this.http.get(url);
  }

  getDetail(id): any {
    //return this.http.get(this.solr_url + '/select?q=id:' + id + '&fl=title,description&wt=json');
    return this.http.get(this.solr_url + "/select?q=id:" + id);
  }
}
