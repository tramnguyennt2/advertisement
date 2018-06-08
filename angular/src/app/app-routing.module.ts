import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {contactComponent} from './contact/app.contactComponent';
import {contentAreaComponent} from './contentArea/app.contentAreaComponent';
import {signupComponent} from './signup/app.signupComponent';
import {signinComponent} from './signin/app.signinComponent';
import {introComponent} from './intro/app.introComponent';
import {adDetailComponent} from './ad-detail/app.adDetailComponent';

const routes: Routes = [
  {path: '', component: contentAreaComponent},
  {path: 'contact', component: contactComponent},
  {path: 'sign-in', component: signinComponent},
  {path: 'sign-up', component: signupComponent},
  {path: 'intro', component: introComponent},
  {path: 'detail', component: adDetailComponent},  
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
