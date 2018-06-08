import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {SolrService} from '../solr.service';
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-ad-detail',
  templateUrl: './ad-detail.component.html',
  styleUrls: ['./ad-detail.component.css']
})
export class AdDetailComponent implements OnInit {
  item = {};

  constructor(private http: HttpClient, private solr: SolrService, private route: ActivatedRoute,) {
    this.display();
  }

  ngOnInit() {
  }

  display() {
    this.item = {};
    return this.solr.getDetail(this.route.snapshot.paramMap.get('id')).subscribe((res) => {
      let doc = res.response.docs[0];
      this.item = {
        'title': doc.title[0],
        'area': doc.area[0],
        'content': doc.content[0],
        'price': doc.price[0]
      };
    });
  }
}
