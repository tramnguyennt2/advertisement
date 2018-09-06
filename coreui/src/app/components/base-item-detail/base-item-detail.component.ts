import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: 'app-base-item-detail',
  templateUrl: './base-item-detail.component.html',
  styleUrls: ['./base-item-detail.component.scss']
})
export class BaseItemDetailComponent implements OnInit {
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
