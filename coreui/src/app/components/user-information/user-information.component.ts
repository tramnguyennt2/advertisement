import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import {CookieService} from 'ngx-cookie-service';
import {UserService} from "../../services/user.service";
import {User} from "../../user";

@Component({
  selector: 'app-user-information',
  templateUrl: './user-information.component.html',
  styleUrls: ['./user-information.component.scss']
})
export class UserInformationComponent implements OnInit {
  user = new User();

  constructor(
    private cookieService: CookieService,
    private spinner: NgxSpinnerService,
    private userService: UserService,
  ) { }

  ngOnInit() {
    this.spinner.show();
    setTimeout(() => {
      this.spinner.hide();
    }, 1000);
    let userId = this.cookieService.get('user_id');
    this.userService.getUser(userId).then(user => this.user.setUser(user));
  }

  updateUser(){
    this.userService.updateUser(this.user);
  }

}
