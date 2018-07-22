import {Component, OnInit} from '@angular/core';
import {Ad} from "../ad";
import {SolrService} from "../solr.service";
import {ItemService} from "../item.service";

@Component({
  selector: 'app-new-ad',
  templateUrl: './new-ad.component.html',
  styleUrls: ['./new-ad.component.css']
})
export class NewAdComponent implements OnInit {
  ad = new Ad('', '', '', '', 0);

  constructor(private itemService: ItemService, private solr: SolrService) {
  }

  ngOnInit() {
  }

  addAd() {
    let a = this.itemService.addItem(this.ad);
    console.log('inserted to couchdb');
    this.ad = new Ad('', '', '', '', 0);
  }
}
