import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppComponent } from './app.component';
import { headerComponent } from './header/app.headerComponent';
import { footerComponent } from './footer/app.footerComponent';
import { searchComponent } from './search/app.searchComponent';
import { homePageComponent } from './home-page/app.homePageComponent';

@NgModule({
  declarations: [
    AppComponent,
    headerComponent,
    footerComponent,
    searchComponent,
    homePageComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
