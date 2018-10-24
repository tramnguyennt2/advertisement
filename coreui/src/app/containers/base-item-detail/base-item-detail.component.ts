import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router, NavigationEnd } from "@angular/router";
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: "app-base-item-detail",
  templateUrl: "./base-item-detail.component.html",
  styleUrls: ["./base-item-detail.component.scss"]
})
export class BaseItemDetailComponent implements OnInit {
  id: string;
  constructor(private router: Router, private route: ActivatedRoute, private spinner: NgxSpinnerService) {
    // override the route reuse strategy
    this.router.routeReuseStrategy.shouldReuseRoute = function() {
      return false;
    };

    this.router.events.subscribe(evt => {
      if (evt instanceof NavigationEnd) {
        // trick the Router into believing it's last link wasn't previously loaded
        this.router.navigated = false;
        // if you need to scroll back to top, here is the right place
        window.scrollTo(0, 0);
      }
    });
  }

  ngOnInit() {
    this.spinner.show();
    setTimeout(() => {
      /** spinner ends after 5 seconds */
      this.spinner.hide();
    }, 1500);
    this.route.queryParams.subscribe(params => {
      this.id = params.id;
    });
    let sidebarEl = document.getElementsByClassName("sidebar-lg-show");
    for (let i = 0; i < sidebarEl.length; i++) {
      sidebarEl[i].classList.remove("sidebar-lg-show");
    }
  }
}
