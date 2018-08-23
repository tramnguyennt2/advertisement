import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {CategoryService} from "../../services/category.service";
import {mouseenterLevel2} from "../../common";

@Component({
  selector: 'app-cat-drop-down',
  templateUrl: './cat-drop-down.component.html',
  styleUrls: ['./cat-drop-down.component.scss']
})
export class CatDropDownComponent implements OnInit {
  cats = [];
  cat_id = 0;
  sub_cat: string = "Danh mục";
  cat: string;
  @Output()
  subCatClick = new EventEmitter();

  constructor(private catService: CategoryService) {
  }

  ngOnInit() {
    this.loadCategory();
  }

  loadCategory() {
    this.catService.getAllCategory().subscribe(cats => {
      this.cats = cats;
    });
  }

  clickSubCategory(event) {
    let oldEl = document.getElementsByClassName("current-level-2");
    for (let i = 0; i < oldEl.length; i++) {
      oldEl[i].classList.remove("active");
    }
    let curEl = event.currentTarget;
    const cls = ["active", "current-level-2"];
    curEl.classList.add(cls);
    this.subCatClick.emit({
      sub_cat_id: curEl.id,
      cat_id: this.cat_id,
      sub_cat: curEl.innerHTML,
      cat: this.cat
    });
    this.sub_cat = curEl.innerHTML;
  }

  mouseenterLevel1(event) {
    let locEl = document.getElementsByClassName("current-level-1");
    for (let i = 0; i < locEl.length; i++) {
      locEl[i].children[1].classList.remove("show");
      locEl[i].children[0].classList.remove("active");
      locEl[i].classList.remove("current-level-1");
    }
    event.currentTarget.classList.add("active");
    let newEl = event.currentTarget.parentElement;
    this.cat_id = newEl.id;
    this.cat = newEl.firstElementChild.innerHTML;
    newEl.classList.add("current-level-1");
    newEl.children[1].classList.add("show");
  }

  mouseenterLevel2(event) {
    mouseenterLevel2(event);
  }
}
