import {Component} from "@angular/core";
import {User} from "../../user";
import {UserService} from "../../services/user.service";
import {ItemService} from "../../services/item.service";
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: "app-dashboard",
  templateUrl: "./default-layout.component.html"
})
export class DefaultLayoutComponent{

  public sidebarMinimized = true;
  private changes: MutationObserver;
  public element: HTMLElement = document.body;
  keyword = "";
  sub_cat_id: number;
  sub_loc_id: number;
  user = new User();
  // check register data
  existEmail = false;
  errorConfirmPassword = false;
  missingRegisterData = false;
  confirmPassword = null;
  // log in data
  email = null;
  password = null;
  errorLoginData = false;
  // Check login
  isLogin = false;
  userId = '';

  constructor(private userService: UserService, private cookieService: CookieService) {
    this.changes = new MutationObserver(mutations => {
      this.sidebarMinimized = document.body.classList.contains(
        "sidebar-minimized"
      );
    });

    this.changes.observe(<Element>this.element, {
      attributes: true
    });
  }

  ngOnInit() {
    let catEl = document.getElementsByTagName('app-cat-drop-down');
    for (let i = 0; i < catEl.length; i++) {
      catEl[i].children[0].classList.add("btn-outline-info");
    }

    let locEl = document.getElementsByTagName('app-loc-drop-down');
    for (let i = 0; i < locEl.length; i++) {
      locEl[i].children[0].classList.add("btn-outline-info");
    }

    this.userId = this.cookieService.get( 'user_id');
    if(this.userId != ''){
      this.isLogin = true;
      this.userService.getUser(this.userId).then(res => {
        this.user.setUser(res);
      });
    }
  }

  getSubCatId(param) {
    this.sub_cat_id = param.sub_cat_id;
  }

  getSubLocId(param) {
    this.sub_loc_id = param.sub_loc_id;
  }

  login(){
    this.userService.loginUser(this.email, this.password).subscribe(res => {
      if(!res){
        this.errorLoginData = true;
        return false;
      }
      this.user.setUser(res);
      document.getElementById('login-modal').classList.remove('show');
      let modalEl = document.getElementsByTagName('bs-modal-backdrop');
      modalEl[0].classList.remove('show');
      let bodyEl = document.getElementsByTagName('body');
      bodyEl[0].classList.remove('modal-open');
      this.isLogin = true;
      this.cookieService.set( 'user_id', res._id );
    });
  }

  register(){
    this.userService.checkEmail(this.user.email).subscribe(res => {
      if(res) {
        this.existEmail = true;
        return false;
      } else {
        this.existEmail = false;
        if(!this.user.email || !this.user.password || !this.user.fullname || !this.user.phone || !this.user.address || !this.confirmPassword){
          this.missingRegisterData = true;
          return false;
        } else{
          this.missingRegisterData = false;
          if(this.user.password != this.confirmPassword){
            this.errorConfirmPassword = true;
            return false;
          } else {
            this.errorConfirmPassword = false;
            let a = this.userService.add(this.user);
            document.getElementById('register-modal').classList.remove('show');
            let modalEl = document.getElementsByTagName('bs-modal-backdrop');
            modalEl[0].classList.remove('show');
            let bodyEl = document.getElementsByTagName('body');
            bodyEl[0].classList.remove('modal-open');
          }
        }
      }
    });
  }

  logout(){
    this.isLogin = false;
    this.cookieService.set( 'user_id', '' );
    this.userId = '';
  }

  onEnterKeyword(){
    let btnSearch = document.getElementById('btn-search');
    btnSearch.click();
  }
}
