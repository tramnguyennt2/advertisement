import {Component, OnInit} from "@angular/core";
import {CategoryService} from "../../services/category.service";
import {LocationService} from "../../services/location.service";

@Component({
  selector: "app-post-ad",
  templateUrl: "./post-ad.component.html",
  styleUrls: ["./post-ad.component.scss"]
})
export class PostAdComponent implements OnInit {
   cat_id = 0;
  sub_cat_id = 0;
  loc_id = 0;
  prov_id = 0;

  constructor(
    private catService: CategoryService,
    private locService: LocationService
  ) {
  }

  ngOnInit() {
  }

  getLocationAndProvId(param) {
    this.loc_id = param.loc_id;
    this.prov_id = param.prov_id;
  }

  getCatAndSubCatId(param) {
    this.cat_id = param.cat_id;
    this.sub_cat_id = param.sub_cat_id;
  }

  mouseenterLevel1(event) {
    let catEl = document.getElementsByClassName("current-level-1");
    for (let i = 0; i < catEl.length; i++) {
      catEl[i].children[1].classList.remove("show");
      catEl[i].children[0].classList.remove("active");
      catEl[i].classList.remove("current-level-1");
    }
    event.currentTarget.classList.add("active");
    let newEl = event.currentTarget.parentElement;
    newEl.classList.add("current-level-1");
    newEl.children[1].classList.add("show");
  }

  mouseenterLevel2(event) {
    let oldEl = document.getElementsByClassName("level-2");
    for (let i = 0; i < oldEl.length; i++) {
      if (!oldEl[i].classList.contains("current-level-2")) {
        oldEl[i].classList.remove("active");
      }
    }
    let newEl = event.currentTarget;
    newEl.classList.add("active");
  }

  clickSubCategory(event) {
    let oldEl = document.getElementsByClassName("current-level-2");
    for (let i = 0; i < oldEl.length; i++) {
      oldEl[i].classList.remove("active");
    }
    let curEl = event.currentTarget;
    const cls = ["active", "current-level-2"];
    curEl.classList.add(cls);
    // this.category =
    // curEl.parentElement.parentElement.parentElement.children[0].innerHTML;
    // this.subCategory = curEl.innerHTML;
  }

  clickProvince(event) {
    let oldEl = document.getElementsByClassName("current-level-2");
    for (let i = 0; i < oldEl.length; i++) {
      oldEl[i].classList.remove("active");
    }
    let curEl = event.currentTarget;
    const cls = ["active", "current-level-2"];
    curEl.classList.add(cls);
    // this.area =
    // curEl.parentElement.parentElement.parentElement.children[0].innerHTML;
    // this.province = curEl.innerHTML;
  }
}
