import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ActivatedRoute} from "@angular/router";
import {Item} from "../item";
import {ItemService} from "../services/item.service";

@Component({
  selector: 'app-ad-detail',
  templateUrl: './ad-detail.component.html',
  styleUrls: ['./ad-detail.component.css']
})
export class AdDetailComponent implements OnInit {
  item = new Item('', '', '','',0);

  constructor(private http: HttpClient, private itemService: ItemService, private route: ActivatedRoute,) {
    this.display();
  }

  ngOnInit() {
  }

  display() {
    this.itemService.getItem(this.route.snapshot.paramMap.get('id')).then((res) => {
      this.item = res;
    });
  }
}
