import { Component, OnInit } from '@angular/core';
import { CategoryService } from "../services/category.service";
import * as locationsJson from 'assets/data/location.json';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  cats = [];
  locations = [];

  constructor(private catService: CategoryService) {
  }

  ngOnInit() {
    //load Category
    this.catService.getAllCategory().subscribe(cats => this.cats = cats);
    // load Location
    this.locations = <any>locationsJson;
    console.log(this.locations);
  }

  clickedCategory(event) {
    var el = document.getElementsByClassName("selected-category");
    for (var i = 0; i < el.length; i++) {
      el[i].classList.remove("selected-category");
    }
    event.target.classList.add("selected-category");
  }

  clickedLocation(event) {
    var el = document.getElementsByClassName("selected-location");
    for (var i = 0; i < el.length; i++) {
      el[i].classList.remove("selected-location");
    }
    event.target.classList.add("selected-location");
  }
}
