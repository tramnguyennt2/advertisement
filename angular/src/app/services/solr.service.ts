import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { environment} from "../../environments/environment";

@Injectable()
export class SolrService {
  solr_url = environment.solr_server + '/advertisement';

  constructor(private http: HttpClient) {
  }

  add(ads) {
    let headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    return this.http.post(this.solr_url + '/update/json/docs?commit=true', ads, {
      headers: headers
    });
  }
  search(keyword, area, cat): any {
    let url = this.solr_url + '/select' +
      '?q=' + keyword + ' AND category:' + cat + ' AND area:' + area + '&wt=json';
    return this.http.get(url);
  }

  getDetail(id): any {
    //return this.http.get(this.solr_url + '/select?q=id:' + id + '&fl=title,description&wt=json');
    return this.http.get(this.solr_url + '/select?q=id:' + id);
  }
}
