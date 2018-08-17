import { Component } from "@angular/core";
import { CategoryService } from "../../services/category.service";
import { LocationService } from "../../services/location.service";

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
  cat_id = 0;
  loc_id = 0;
  cat = "Danh mục";
  loc = "Khu vực";

  constructor(
    private catService: CategoryService,
    private locService: LocationService
  ) {
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
    this.loadCategory();
    // load Location
    this.loadLocation();
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
        this.navObjs.push({ navItem });
      }
      for (let n of this.navObjs) {
        this.navItems.push(n["navItem"]);
      }
    });
  }

  loadLocation() {
    this.locService.getAllLocation().subscribe(locs => {
      this.locations = locs;
    });
  }

  mouseenterLocation(event) {
    let locEl = document.getElementsByClassName("current-location");
    for (let i = 0; i < locEl.length; i++) {
      locEl[i].children[1].classList.remove("show");
      locEl[i].classList.remove("current-location");
    }
    let curEl = event.currentTarget.parentElement;
    curEl.classList.add("current-location");
    curEl.children[1].classList.add("show");
  }

  clickCat(event) {
    let curEl = event.currentTarget;
    curEl.classList.add("active");
    this.cat = curEl.innerHTML;
    this.cat_id = curEl.id;
  }

  mouseenterLevel1(event){
    let catEl = document.getElementsByClassName("current-level-1");
    for (let i = 0; i < catEl.length; i++){
      catEl[i].children[1].classList.remove("show");
      catEl[i].children[0].classList.remove("active");
      catEl[i].classList.remove("current-level-1");
    }
    event.currentTarget.classList.add("active");
    let newEl = event.currentTarget.parentElement;
    newEl.classList.add("current-level-1");
    newEl.children[1].classList.add("show");
  }

  mouseenterLevel2(event){
    let oldEl = document.getElementsByClassName("level-2");
    for (let i = 0; i < oldEl.length; i++){
      if(!(oldEl[i].classList.contains("current-level-2"))){
        oldEl[i].classList.remove("active");
      }
    }
    let newEl = event.currentTarget;
    newEl.classList.add("active");
  }

  clickProvince(event){
    let oldEl = document.getElementsByClassName("current-level-2");
    for (let i = 0; i < oldEl.length; i++){
      oldEl[i].classList.remove("active");
    }
    let curEl = event.currentTarget;
    const cls = ["active", "current-level-2"];
    curEl.classList.add(cls);
    // this.area = curEl.parentElement.parentElement.parentElement.children[0].innerHTML;
    this.loc = curEl.innerHTML;
    this.loc_id = curEl.id;
  }

  getCats(){
    return this.cats;
  }

  getLocations(){
    return this.locations;
  }
}
