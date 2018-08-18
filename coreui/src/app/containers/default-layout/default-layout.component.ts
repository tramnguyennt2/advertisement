import {Component} from "@angular/core";

@Component({
  selector: "app-dashboard",
  templateUrl: "./default-layout.component.html"
})
export class DefaultLayoutComponent {
  public sidebarMinimized = true;
  private changes: MutationObserver;
  public element: HTMLElement = document.body;
  keyword = "";
  sub_cat_id: number;
  prov_id: number;

  constructor(){
    this.changes = new MutationObserver(mutations => {
      this.sidebarMinimized = document.body.classList.contains(
        "sidebar-minimized"
      );
    });

    this.changes.observe(<Element>this.element, {
      attributes: true
    });
  }

  ngOnInit() {}


  getCatAndSubCatId(param){
    this.sub_cat_id = param.sub_cat_id;
  }
  getProvId(param) {
    this.prov_id = param.prov_id;
  }
}
