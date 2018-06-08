import {Component} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {SolrService} from '../solr.service';

@Component({
  selector: 'detail',
  templateUrl: './adDetail.html',
  styleUrls: ['./adDetail.css']
})
export class adDetailComponent {
  item = {};
  constructor(private http: HttpClient, private solr: SolrService) {
    this.display();
  }

  display() {
    this.item = {};
    return this.solr.getDetail('e08b2724-ef1b-419d-b97a-bf66b426e701').subscribe((res) => {
        let doc = res.response.docs[0];
        this.item = {
          'title': doc.title,
          'area': doc.area,
          'content': doc.content,
          'price': doc.price
        };
    });
  }
}
