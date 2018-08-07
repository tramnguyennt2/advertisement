import {Component, OnInit} from '@angular/core';
import {Item} from "../item";
import {SolrService} from "../services/solr.service";
import {ItemService} from "../services/item.service";

@Component({
  selector: 'app-new-ad',
  templateUrl: './new-ad.component.html',
  styleUrls: ['./new-ad.component.css']
})
export class NewAdComponent implements OnInit {
  ad = new Item('', '', '', '', 0);

  constructor(private itemService: ItemService, private solr: SolrService) {
  }

  ngOnInit() {
  }

  addAd() {
    let a = this.itemService.addItem(this.ad);
    console.log('inserted to couchdb');
    this.ad = new Item('', '', '', '', 0);
  }
}
