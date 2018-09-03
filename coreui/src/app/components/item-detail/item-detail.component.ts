import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-item-detail",
  templateUrl: "./item-detail.component.html",
  styleUrls: ["./item-detail.component.scss"]
})
export class ItemDetailComponent implements OnInit {
  id: string;
  constructor(private route: ActivatedRoute) {
    this.route.queryParams.subscribe(params => {
      this.id = params.id;
    });
  }

  ngOnInit() {
    let sidebarEl = document.getElementsByClassName("sidebar-lg-show");
    for (let i = 0; i < sidebarEl.length; i++) {
      sidebarEl[i].classList.remove("sidebar-lg-show");
    }
  }
}
