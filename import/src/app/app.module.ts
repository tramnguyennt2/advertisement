import { BrowserModule } from '@angular/platform-browser';
import {RouterModule} from '@angular/router';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppComponent } from './app.component';
import { DataService } from './data.service';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';



@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    NgbModule.forRoot(),
    RouterModule.forRoot([
      // { path: '', component: contentAreaComponent },
      // { path: 'contact', component: contactComponent },
      // { path: 'sign-in', component: signinComponent },
      // { path: 'sign-up', component: signupComponent },
      // { path: 'intro', component: introComponent },
    ]),
    HttpClientModule,
    FormsModule,
  ],
  providers: [
    DataService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
