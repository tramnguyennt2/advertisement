import { Component, OnInit } from "@angular/core";
import { CategoryService } from "../../services/category.service";

@Component({
  selector: "app-homepage",
  templateUrl: "./homepage.component.html",
  styleUrls: ["./homepage.component.scss"]
})
export class HomepageComponent implements OnInit {
  cats = [];
  icons = [];
  catColors = ['bg-primary', 'bg-warning', 'bg-success', 'bg-danger', 'bg-secondary', 'bg-primary', 'bg-warning', 'bg-success']

  constructor(private catService: CategoryService) {}

  ngOnInit() {
    // load Category and number of item
    this.catService.getItemNumberOfCategory().subscribe(cats => {
      this.cats = cats;
      this.catService.getAllCategory().subscribe(catObj => {
        cats.map(cat => {
          catObj.map(obj => {
            if(obj.cat_name == cat.key){
              this.icons.push(obj.cat_icon);
            }
          });
        });
      });
    });
  }
}
