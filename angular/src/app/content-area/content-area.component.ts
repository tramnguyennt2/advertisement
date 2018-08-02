import { Component, OnInit } from '@angular/core';
import {CategoryService} from "../category.service";

@Component({
  selector: 'app-content-area',
  templateUrl: './content-area.component.html',
  styleUrls: ['./content-area.component.css']
})
export class ContentAreaComponent implements OnInit {
  cats = [];

  constructor(private catService: CategoryService) {
  }

  ngOnInit() {
    //load Category
    this.catService.getAllCategory().subscribe(cats => this.cats = cats);
  }

}
