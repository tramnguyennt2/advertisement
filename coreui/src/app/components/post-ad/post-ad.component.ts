import { Component, OnInit } from '@angular/core';
import { CategoryService } from "../../services/category.service";
import locationsJson from "assets/data/location.json";

@Component({
  selector: 'app-post-ad',
  templateUrl: './post-ad.component.html',
  styleUrls: ['./post-ad.component.scss']
})
export class PostAdComponent implements OnInit {
  cats = [];
  locations = [];
  category = '';
  subCategory = 'Chọn danh mục';
  area = '';
  province = 'Chọn khu vực';

  constructor(private catService: CategoryService) { }

  ngOnInit() {
    //load category
    this.catService.getAllCategory().subscribe(cats => {
      this.cats = cats;
      console.log(this.cats)
    });
    // load Location
    let locationObj = <any>locationsJson;
    this.locations = Object.keys(locationObj).map(function(locationIndex) {
      let location = locationObj[locationIndex];
      return location;
    });
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

  clickSubCategory(event){
    let oldEl = document.getElementsByClassName("current-level-2");
    for (let i = 0; i < oldEl.length; i++){
      oldEl[i].classList.remove("active");
    }
    let curEl = event.currentTarget;
    const cls = ["active", "current-level-2"];
    curEl.classList.add(cls);
    this.category = curEl.parentElement.parentElement.parentElement.children[0].innerHTML;
    this.subCategory = curEl.innerHTML;
  }

  clickProvince(event){
    let oldEl = document.getElementsByClassName("current-level-2");
    for (let i = 0; i < oldEl.length; i++){
      oldEl[i].classList.remove("active");
    }
    let curEl = event.currentTarget;
    const cls = ["active", "current-level-2"];
    curEl.classList.add(cls);
    this.area = curEl.parentElement.parentElement.parentElement.children[0].innerHTML;
    this.province = curEl.innerHTML;
  }

}
