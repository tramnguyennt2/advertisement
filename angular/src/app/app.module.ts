import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {AppComponent} from './app.component';
import {FormsModule} from "@angular/forms";
import {HttpClientModule} from "@angular/common/http";
import {AppRoutingModule} from './app-routing.module';
import {PouchdbService} from "./pouchdb.service";
import {SolrService} from "./solr.service";
import {AdDetailComponent} from './ad-detail/ad-detail.component';
import {CategoryComponent} from './category/category.component';
import {ContactComponent} from './contact/contact.component';
import {ContentAreaComponent} from './content-area/content-area.component';
import {FooterComponent} from './footer/footer.component';
import {HeaderComponent} from './header/header.component';
import {IntroComponent} from './intro/intro.component';
import {NavComponent} from './nav/nav.component';
import {SearchComponent} from './search/search.component';
import {SigninComponent} from './signin/signin.component';
import {SignupComponent} from './signup/signup.component';
import {TopProductComponent} from './top-product/top-product.component';
import {NewAdComponent} from './new-ad/new-ad.component';
import {NodeService} from "./node.service";

@NgModule({
  declarations: [
    AppComponent,
    AdDetailComponent,
    CategoryComponent,
    ContactComponent,
    ContentAreaComponent,
    FooterComponent,
    HeaderComponent,
    IntroComponent,
    NavComponent,
    SearchComponent,
    SigninComponent,
    SignupComponent,
    TopProductComponent,
    NewAdComponent
  ],
  imports: [
    FormsModule,
    BrowserModule,
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [
    PouchdbService,
    SolrService,
    NodeService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {

}
