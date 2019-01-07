import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ItemService} from "../../services/item.service";
import {Item} from '../../item';

@Component({
  selector: 'app-update-ad',
  templateUrl: './update-ad.component.html',
  styleUrls: ['./update-ad.component.scss']
})
export class UpdateAdComponent implements OnInit {
  item: Item;

  constructor(private route: ActivatedRoute, private itemService: ItemService,) {
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.itemService.getItem(params.id).then(item => {
        let itemObj = new Item();
        itemObj.setItem(item);
        this.item = itemObj;
      });
    });
  }
}
