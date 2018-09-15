import {Component} from "@angular/core";
import {User} from "../../user";
import {UserService} from "../../services/user.service";
import {ItemService} from "../../services/item.service";

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
  prov_id: number;
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

  constructor(private userService: UserService) {
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

  }

  getSubCatId(param) {
    this.sub_cat_id = param.sub_cat_id;
  }

  getProvId(param) {
    this.prov_id = param.prov_id;
  }

  login(){
    this.userService.getUser(this.email, this.password).subscribe(res => {
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
    });
  }

  register(){
    if(this.user.password != this.confirmPassword){
      this.errorConfirmPassword = true;
      return false;
    } else {
      this.errorConfirmPassword = false;
    }
    if(!this.user.email || !this.user.password || !this.user.fullname){
      this.missingRegisterData = true;
      return false;
    } else{
      this.missingRegisterData = false;
    }
    let a = this.userService.addUser(this.user);
    document.getElementById('register-modal').classList.remove('show');
    let modalEl = document.getElementsByTagName('bs-modal-backdrop');
    modalEl[0].classList.remove('show');
    let bodyEl = document.getElementsByTagName('body');
    bodyEl[0].classList.remove('modal-open');
  }

  logout(){
    this.isLogin = false;
  }
}
