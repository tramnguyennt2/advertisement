import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
// Import Containers
import { DefaultLayoutComponent } from "./containers";
// Import Components
import { HomepageComponent } from "./containers/homepage/homepage.component";
import { SearchAdComponent } from "./components/search-ad/search-ad.component";
import { PostAdComponent } from "./components/post-ad/post-ad.component";
import {ItemDetailComponent} from "./components/item-detail/item-detail.component";

export const routes: Routes = [
  {
    path: "",
    component: DefaultLayoutComponent,
    children: [
      { path: "", component: HomepageComponent },
      { path: "post-ad", component: PostAdComponent },
      { path: "search-ad", component: SearchAdComponent },
      { path: "item-detail", component: ItemDetailComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
