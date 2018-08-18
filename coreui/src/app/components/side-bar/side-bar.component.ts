import {Component, OnInit} from '@angular/core';
import {CategoryService} from "../../services/category.service";

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.scss']
})
export class SideBarComponent implements OnInit {
  public navItems = [
    {
      title: true,
      name: "Danh mục"
    }
  ];
  cats = [];
  navObjs = [];

  constructor(private catService: CategoryService) {
  }

  ngOnInit() {
    this.loadCategory();
  }

  loadCategory() {
    this.navObjs = [];
    this.navItems = [];
    // load Category
    this.catService.getAllCategory().subscribe(cats => {
      this.cats = cats;
      for (let cat of this.cats) {
        let navItem = {
          name: cat["cat_name"],
          url: "/search",
          icon: "fa fa-desktop",
          children: []
        };
        for (let sub of cat["subs"]) {
          navItem.children.push({
            name: sub["name"],
            url: "/base/cards",
            icon: "icon"
          });
        }
        this.navObjs.push({navItem});
      }
      for (let n of this.navObjs) {
        this.navItems.push(n["navItem"]);
      }
    });
  }
}
