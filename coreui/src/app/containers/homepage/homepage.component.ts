import { Component, OnInit } from "@angular/core";
import { CategoryService } from "../../services/category.service";

@Component({
  selector: "app-homepage",
  templateUrl: "./homepage.component.html",
  styleUrls: ["./homepage.component.scss"]
})
export class HomepageComponent implements OnInit {
  cats = [];
  icon = [];
  catObj: any;

  constructor(private catService: CategoryService) {}

  ngOnInit() {
    // load Category and number of item
    this.catService.getItemNumberOfCategory().subscribe(cats => {
      this.cats = cats;

      this.catService.getAllCategory().subscribe(catObj => {
        catObj.map((cat, index) =>{
          console.log(cat, index)
        })
      });
    });
  }
}
