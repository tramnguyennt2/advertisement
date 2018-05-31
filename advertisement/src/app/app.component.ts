import { Component } from '@angular/core';
import { headerComponent } from './header/app.headerComponent';
import { footerComponent } from './footer/app.footerComponent';
import { searchComponent } from './search/app.searchComponent';
import { homePageComponent } from './home-page/app.homePageComponent';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
}
