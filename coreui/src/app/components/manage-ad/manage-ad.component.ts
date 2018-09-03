import { Component, OnInit } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { ModalModule } from 'ngx-bootstrap/modal';
import { BsModalService } from "ngx-bootstrap/modal";

@Component({
  selector: 'app-manage-ad',
  templateUrl: './manage-ad.component.html',
  styleUrls: ['./manage-ad.component.scss']
})
export class ManageAdComponent implements OnInit {
  public dangerModal;

  constructor() { }

  ngOnInit() {
    let sidebarEl = document.getElementsByClassName("sidebar-lg-show");
    for (let i = 0; i < sidebarEl.length; i++) {
      sidebarEl[i].classList.remove("sidebar-lg-show");
    }
  }

}
