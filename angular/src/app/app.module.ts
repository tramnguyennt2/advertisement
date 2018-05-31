import { BrowserModule } from '@angular/platform-browser';
import {RouterModule} from '@angular/router';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppComponent } from './app.component';
import { headerComponent } from './header/app.headerComponent';
import { navComponent } from './nav/app.navComponent';
import { contentAreaComponent } from './contentArea/app.contentAreaComponent';
import { footerComponent } from './footer/app.footerComponent';
import { introComponent } from './intro/app.introComponent';
import { searchComponent } from './search/app.searchComponent';
import { categoryComponent } from './category/app.categoryComponent';
import { signinComponent } from './signin/app.signinComponent';
import { signupComponent } from './signup/app.signupComponent';
import { contactComponent } from './contact/app.contactComponent';
import { topProductComponent } from './top-product/app.topProductComponent';

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
    BrowserModule,
    NgbModule.forRoot(),
    RouterModule.forRoot([
      { path: '', component: contentAreaComponent },
      { path: 'contact', component: contactComponent },
      { path: 'sign-in', component: signinComponent },
      { path: 'sign-up', component: signupComponent },
      { path: 'intro', component: introComponent },
    ]),
  ],
  providers: [

  ],
  bootstrap: [AppComponent]
})
export class AppModule { 
  
}
