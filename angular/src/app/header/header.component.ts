import { Component, OnInit } from '@angular/core';
import { CategoryService } from "../category.service";
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

  clicked(event) {
    var el = document.getElementsByClassName("selected");
    for (var i = 0; i < el.length; i++) {
      el[i].classList.remove("selected");
    }
    //el.classList.remove("selected");
    event.target.classList.add('selected');
  }
}
