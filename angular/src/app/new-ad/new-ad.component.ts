import {Component, OnInit} from '@angular/core';
import {Ad} from "../ad";
import {PouchdbService} from "../pouchdb.service";
import {SolrService} from "../solr.service";

@Component({
  selector: 'app-new-ad',
  templateUrl: './new-ad.component.html',
  styleUrls: ['./new-ad.component.css']
})
export class NewAdComponent implements OnInit {
  ad = new Ad('', '', '', '', 0);

  constructor(private pouchdb: PouchdbService, private solr: SolrService) {
  }

  ngOnInit() {
  }

  addAd() {
    let a = this.pouchdb.addAd(this.ad);
    console.log('inserted to couchdb');
    this.ad = new Ad('', '', '', '', 0);
  }
}
