import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ItemService} from "../../services/item.service";
import {Item} from '../../item';
import {Location} from '@angular/common';

@Component({
  selector: 'app-update-ad',
  templateUrl: './update-ad.component.html',
  styleUrls: ['./update-ad.component.scss']
})
export class UpdateAdComponent implements OnInit {
  item: Item;
  url: string;

  constructor(
    private route: ActivatedRoute,
    private itemService: ItemService,
    private _location: Location) {
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.itemService.getItem(params.id).then(item => {
        let itemObj = new Item();
        itemObj.setItem(item);
        this.item = itemObj;
        // let subCat = document.getElementsByName('app-cat-drop-down');
        if(item.image && item.image != 'khong co'){
          this.url = item.image;
        }
        else if(item._attachments){
          this.url = 'http://localhost:5984/advertisement/' + item._id + '/image';
        }
      });
    });
  }

  updateItem(){
    this.itemService.updateItem(this.item);
  }

  back() {
    this._location.back();
  }

  // getLocationAndSubLocId(param) {
  //   this.item.loc_id = param.loc_id;
  //   this.item.loc = param.loc;
  //   this.item.sub_loc_id = param.sub_loc_id;
  //   this.item.sub_loc = param.sub_loc;
  // }
  //
  //
  // getCatAndSubCatId(param) {
  //   this.item.cat_id = param.cat_id;
  //   this.item.cat = param.cat;
  //   this.item.sub_cat_id = param.sub_cat_id;
  //   this.item.sub_cat = param.sub_cat;
  // }
}
