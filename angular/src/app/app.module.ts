import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {AppComponent} from './app.component';
import {headerComponent} from './header/app.headerComponent';
import {navComponent} from './nav/app.navComponent';
import {contentAreaComponent} from './contentArea/app.contentAreaComponent';
import {footerComponent} from './footer/app.footerComponent';
import {introComponent} from './intro/app.introComponent';
import {searchComponent} from './search/app.searchComponent';
import {categoryComponent} from './category/app.categoryComponent';
import {signinComponent} from './signin/app.signinComponent';
import {signupComponent} from './signup/app.signupComponent';
import {contactComponent} from './contact/app.contactComponent';
import {topProductComponent} from './top-product/app.topProductComponent';
import {FormsModule} from "@angular/forms";
import {HttpClientModule} from "@angular/common/http";
import {AppRoutingModule} from './app-routing.module';
import {PouchdbService} from "./pouchdb.service";
import {SolrService} from "./solr.service";

@NgModule({
  declarations: [
    AppComponent,
    headerComponent,
    navComponent,
    introComponent,
    contentAreaComponent,
    footerComponent,
    searchComponent,
    categoryComponent,
    signinComponent,
    signupComponent,
    contactComponent,
    topProductComponent,
  ],
  imports: [
    FormsModule,
    BrowserModule,
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [
    PouchdbService,
    SolrService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {

}
