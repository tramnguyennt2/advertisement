import { Component, OnInit } from '@angular/core';
import { ItemService } from "../../services/item.service";
import { Item } from "../../item";
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-all-items',
  templateUrl: './all-items.component.html',
  styleUrls: ['./all-items.component.scss']
})
export class AllItemsComponent implements OnInit {
  catId: string;
  subCatId: string;
  items: Item[];
  total: 0;
  p: number = 1;

  constructor(private itemService: ItemService, private spinner: NgxSpinnerService) {}

  ngOnInit() {
    this.spinner.show();
    setTimeout(() => {
      /** spinner ends after 5 seconds */
      this.spinner.hide();
    }, 5000);
    let url = window.location.href;
    let arr = url.substring(36, url.length).split('/sub-cat-');
    this.catId = arr[0];
    this.subCatId = arr[1];
    this.itemService.getAllItems(this.catId, this.subCatId).subscribe(items => {
      this.items = items;
      this.total = items.length;
    });
  }

}
