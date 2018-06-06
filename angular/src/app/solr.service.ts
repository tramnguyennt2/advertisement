import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Injectable()
export class SolrService {
  solr_url = 'http://localhost:8983/solr/advertisement';

  constructor(private http: HttpClient) {
  }

  add(ads) {
    let headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    return this.http.post(this.solr_url + '/update/json/docs?commit=true', ads, {
      headers: headers
    });
  }

  search(keyword): any {
    let url = this.solr_url + '/select' +
      '?q=' + keyword + '&fl=title,description,id&rows=10&hl=on' +
      '&hl.fl=*&hl.simple.pre=%3Cstrong%3E&hl.simple.post=%3C/strong%3E&wt=json';
    return this.http.get(url);
  }

  getDetail(id): any {
    return this.http.get(this.solr_url + '/select?q=id:' + id + '&fl=title,description&wt=json');
  }
}