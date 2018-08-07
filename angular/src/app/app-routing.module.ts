import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AdDetailComponent} from "./ad-detail/ad-detail.component";
import {ContactComponent} from "./contact/contact.component";
import {DashboardComponent} from "./dashboard/dashboard.component";
import {IntroComponent} from "./intro/intro.component";
import {SigninComponent} from "./signin/signin.component";
import {SignupComponent} from "./signup/signup.component";
import {NewAdComponent} from "./new-ad/new-ad.component";
import {SearchComponent} from "./search/search.component";

const routes: Routes = [
  {path: '', component: DashboardComponent},
  {path: 'contact', component: ContactComponent},
  {path: 'sign-in', component: SigninComponent},
  {path: 'sign-up', component: SignupComponent},
  {path: 'intro', component: IntroComponent},
  {path: 'detail/:id', component: AdDetailComponent},
  {path: 'new-ad', component: NewAdComponent},
  {path: 'search', component: SearchComponent},
];

@NgModule({
  imports: [
    // Exporting RouterModule makes router directives available for use in the AppModule components that will need them
    RouterModule.forRoot(routes)
  ],
  // Exporting RouterModule makes router directives available for use in the AppModule components that will need them
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule {
}
