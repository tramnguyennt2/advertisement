import {Component, OnInit} from '@angular/core';
import {CategoryService} from "../services/category.service";

@Component({
  selector: 'app-category-detail',
  templateUrl: './category-detail.component.html',
  styleUrls: ['./category-detail.component.css']
})
export class CategoryDetailComponent implements OnInit {
  cats = [];

  constructor(private catService: CategoryService) {
  }

  ngOnInit() {
    //load Category
    this.catService.getAllCategory().subscribe(cats => this.cats = cats);
  }

}
