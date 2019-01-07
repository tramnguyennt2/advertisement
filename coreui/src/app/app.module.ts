import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { PouchdbService } from "./services/pouchdb.service";
import { SolrService } from "./services/solr.service";
import { NodeService } from "./services/node.service";
import { CategoryService } from "./services/category.service";
import { ItemService } from "./services/item.service";
import { UserService } from "./services/user.service";
import { RsService } from "./services/rs.service";
import { CookieService } from 'ngx-cookie-service';

import { PerfectScrollbarModule } from "ngx-perfect-scrollbar";
import { PERFECT_SCROLLBAR_CONFIG } from "ngx-perfect-scrollbar";
import { PerfectScrollbarConfigInterface } from "ngx-perfect-scrollbar";
import { ModalModule } from "ngx-bootstrap/modal";
import { NgxSpinnerModule } from 'ngx-spinner';
import {NgxPaginationModule} from 'ngx-pagination';


const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};

import { AppComponent } from "./app.component";

// Import containers
import { DefaultLayoutComponent } from "./containers";
import { BaseItemDetailComponent } from './containers/base-item-detail/base-item-detail.component';
import { HomepageComponent } from "./containers/homepage/homepage.component";

const APP_CONTAINERS = [DefaultLayoutComponent];

import {
  AppAsideModule,
  AppBreadcrumbModule,
  AppHeaderModule,
  AppFooterModule,
  AppSidebarModule
} from "@coreui/angular";

// Import routing module
import { AppRoutingModule } from "./app.routing";

// Import 3rd party components
import { BsDropdownModule } from "ngx-bootstrap/dropdown";
import { TabsModule } from "ngx-bootstrap/tabs";
import { ChartsModule } from "ng2-charts/ng2-charts";

import { NewAdsComponent } from "./components/new-ads/new-ads.component";
import { LocDropDownComponent } from "./components/loc-drop-down/loc-drop-down.component";
import { CatDropDownComponent } from "./components/cat-drop-down/cat-drop-down.component";
import { SideBarComponent } from "./components/side-bar/side-bar.component";
import { ItemDetailComponent } from "./components/item-detail/item-detail.component";
import { SearchAdComponent } from "./components/search-ad/search-ad.component";
import { ItemComponent } from "./components/item/item.component";
import { RsResultComponent } from "./components/rs-result/rs-result.component";
import { ManageAdComponent } from "./components/manage-ad/manage-ad.component";
import { PostAdComponent } from "./components/post-ad/post-ad.component";
import { AllItemsComponent } from './components/all-items/all-items.component';
import { UserInformationComponent } from './components/user-information/user-information.component';
import { UpdateAdComponent } from './components/update-ad/update-ad.component';

@NgModule({
  imports: [
    FormsModule,
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    AppAsideModule,
    AppBreadcrumbModule.forRoot(),
    AppFooterModule,
    AppHeaderModule,
    AppSidebarModule,
    PerfectScrollbarModule,
    BsDropdownModule.forRoot(),
    TabsModule.forRoot(),
    ChartsModule,
    ModalModule.forRoot(),
    NgxSpinnerModule,
    NgxPaginationModule
  ],
  declarations: [
    AppComponent,
    ...APP_CONTAINERS,
    PostAdComponent,
    HomepageComponent,
    NewAdsComponent,
    LocDropDownComponent,
    CatDropDownComponent,
    SideBarComponent,
    ItemComponent,
    SideBarComponent,
    ItemDetailComponent,
    SearchAdComponent,
    RsResultComponent,
    BaseItemDetailComponent,
    AllItemsComponent,
    UserInformationComponent,
    ManageAdComponent,
    UpdateAdComponent,
  ],
  providers: [
    PouchdbService,
    SolrService,
    NodeService,
    CategoryService,
    ItemService,
    UserService,
    RsService,
    CookieService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
