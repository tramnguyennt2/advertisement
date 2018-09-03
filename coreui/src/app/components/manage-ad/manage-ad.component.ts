import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-manage-ad',
  templateUrl: './manage-ad.component.html',
  styleUrls: ['./manage-ad.component.scss']
})
export class ManageAdComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    let sidebarEl = document.getElementsByClassName("sidebar-lg-show");
    for (let i = 0; i < sidebarEl.length; i++) {
      sidebarEl[i].classList.remove("sidebar-lg-show");
    }
  }

}
