import { Component, OnInit } from "@angular/core";
import { CategoryService } from "../../services/category.service";
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: "app-homepage",
  templateUrl: "./homepage.component.html",
  styleUrls: ["./homepage.component.scss"]
})
export class HomepageComponent implements OnInit {
  // // chart
  // public pieChartLabels: string[] = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
  // public pieChartData: number[] = [1,2,3,4,5,3,4];
  // public pieChartType = 'pie';

  cats = [];
  icons = [];
  catColors = ['bg-primary', 'bg-warning', 'bg-success', 'bg-danger', 'bg-secondary', 'bg-primary', 'bg-warning', 'bg-success']
  textColors = ['text-primary', 'text-warning', 'text-success', 'text-danger', 'text-secondary', 'text-primary', 'text-warning', 'text-success']

  constructor(private catService: CategoryService, private spinner: NgxSpinnerService) {}

  ngOnInit() {
    this.spinner.show();
    setTimeout(() => {
      /** spinner ends after 5 seconds */
      this.spinner.hide();
    }, 3000);
    // load Category and number of item
    this.catService.getItemNumberOfCategory().subscribe(cats => {
      this.cats = cats;
      console.log(this.cats)
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
