import {Component, OnInit} from '@angular/core';
import {Item} from "../item";
import {ItemService} from "../../services/item.service";

@Component({
  selector: 'new-ads',
  templateUrl: './new-ads.component.html',
  styleUrls: ['./new-ads.component.css']
})
export class NewAdsComponent implements OnInit {
  items: Item[];

  constructor(private itemService: ItemService) {

  }

  ngOnInit() {
    this.itemService.getLastestItems().subscribe(items => this.items = items);
  }
}
