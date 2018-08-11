import { Component } from "@angular/core";
import { navItems } from "./../../_nav";
import { CategoryService } from "../../services/category.service";
import locationsJson from "assets/data/location.json";

@Component({
  selector: "app-dashboard",
  templateUrl: "./default-layout.component.html"
})
export class DefaultLayoutComponent {
  public navItems = [
    {
      title: true,
      name: "Danh mục"
    }
  ];
  public sidebarMinimized = true;
  private changes: MutationObserver;
  public element: HTMLElement = document.body;
  cats = [];
  locations = [];
  keyword = "";
  navObjs = [];

  constructor(private catService: CategoryService) {
    this.changes = new MutationObserver(mutations => {
      this.sidebarMinimized = document.body.classList.contains(
        "sidebar-minimized"
      );
    });

    this.changes.observe(<Element>this.element, {
      attributes: true
    });
  }

  ngOnInit() {
    // load Category
    this.catService.getAllCategory().subscribe(cats => {
      this.cats = cats;
      for (let cat of this.cats) {
        let navItem = {
          name: cat["category"],
          url: "/search",
          icon: "fa fa-desktop",
          children: []
        };
        for (let sub of cat["name"]) {
          navItem.children.push({
            name: sub,
            url: "/base/cards",
            icon: "icon"
          });
        }
        this.navObjs.push({ navItem });
      }
      for (let n of this.navObjs) {
        this.navItems.push(n["navItem"]);
      }
      console.log("this.navObjs: ", this.navObjs);
    });
    // load Location
    let locationObj = <any>locationsJson;
    this.locations = Object.keys(locationObj).map(function(locationIndex) {
      let location = locationObj[locationIndex];
      return location;
    });
  }
}
