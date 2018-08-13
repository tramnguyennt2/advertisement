import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
// Import Containers
import { DefaultLayoutComponent } from "./containers";
// Import Components
import { HomepageComponent } from "./components/homepage/homepage.component";
import { SearchComponent } from "./components/search/search.component";
import { PostAdComponent } from "./components/post-ad/post-ad.component";

export const routes: Routes = [
  {
    path: "",
    component: DefaultLayoutComponent,
    children: [
      { path: "", component: HomepageComponent },
      { path: "post-ad", component: PostAdComponent },
      { path: "search", component: SearchComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}