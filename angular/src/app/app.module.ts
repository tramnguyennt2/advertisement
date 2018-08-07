import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {AppComponent} from './app.component';
import {FormsModule} from "@angular/forms";
import {HttpClientModule} from "@angular/common/http";
import {AppRoutingModule} from './app-routing.module';
import {PouchdbService} from "../services/pouchdb.service";
import {SolrService} from "../services/solr.service";
import {AdDetailComponent} from './ad-detail/ad-detail.component';
import {ContactComponent} from './contact/contact.component';
import {DashboardComponent} from './dashboard/dashboard.component';
import {FooterComponent} from './footer/footer.component';
import {HeaderComponent} from './header/header.component';
import {IntroComponent} from './intro/intro.component';
import {NavComponent} from './nav/nav.component';
import {SearchComponent} from './search/search.component';
import {SigninComponent} from './signin/signin.component';
import {SignupComponent} from './signup/signup.component';
import {TopProductComponent} from './top-product/top-product.component';
import {NewAdComponent} from './new-ad/new-ad.component';
import {NodeService} from "../services/node.service";
import {CategoryService} from "../services/category.service";
import {ItemService} from "../services/item.service";
import { NewAdsComponent } from './new-ads/new-ads.component';

@NgModule({
  declarations: [
    AppComponent,
    AdDetailComponent,
    ContactComponent,
    DashboardComponent,
    FooterComponent,
    HeaderComponent,
    IntroComponent,
    NavComponent,
    SearchComponent,
    SigninComponent,
    SignupComponent,
    TopProductComponent,
    NewAdComponent,
    NewAdsComponent
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
    NodeService,
    CategoryService,
    ItemService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {

}
