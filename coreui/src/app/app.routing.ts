import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
// Import Containers
import { DefaultLayoutComponent } from "./containers";
// Import Components
import { HomepageComponent } from "./containers/homepage/homepage.component";
import { SearchAdComponent } from "./components/search-ad/search-ad.component";
import { PostAdComponent } from "./components/post-ad/post-ad.component";
import { ManageAdComponent } from "./components/manage-ad/manage-ad.component";
import { BaseItemDetailComponent } from "./containers/base-item-detail/base-item-detail.component";
import { AllItemsComponent } from "./components/all-items/all-items.component";
import { UserInformationComponent } from './components/user-information/user-information.component';

export const routes: Routes = [
  {
    path: "",
    component: DefaultLayoutComponent,
    children: [
      { path: "", component: HomepageComponent },
      { path: "post-ad", component: PostAdComponent },
      { path: "search-ad", component: SearchAdComponent },
      { path: "manage-ad", component: ManageAdComponent },
      { path: "item-detail", component: BaseItemDetailComponent },
      { path: "user-information", component: UserInformationComponent },
      { path: "all-items/cat-1/sub-cat-1", component: AllItemsComponent },
      { path: "all-items/cat-1/sub-cat-2", component: AllItemsComponent },
      { path: "all-items/cat-1/sub-cat-3", component: AllItemsComponent },
      { path: "all-items/cat-1/sub-cat-4", component: AllItemsComponent },
      { path: "all-items/cat-1/sub-cat-5", component: AllItemsComponent },
      { path: "all-items/cat-1/sub-cat-6", component: AllItemsComponent },
      { path: "all-items/cat-1/sub-cat-7", component: AllItemsComponent },
      { path: "all-items/cat-2/sub-cat-8", component: AllItemsComponent },
      { path: "all-items/cat-2/sub-cat-9", component: AllItemsComponent },
      { path: "all-items/cat-2/sub-cat-10", component: AllItemsComponent },
      { path: "all-items/cat-2/sub-cat-11", component: AllItemsComponent },
      { path: "all-items/cat-2/sub-cat-12", component: AllItemsComponent },
      { path: "all-items/cat-3/sub-cat-13", component: AllItemsComponent },
      { path: "all-items/cat-3/sub-cat-14", component: AllItemsComponent },
      { path: "all-items/cat-3/sub-cat-15", component: AllItemsComponent },
      { path: "all-items/cat-3/sub-cat-16", component: AllItemsComponent },
      { path: "all-items/cat-3/sub-cat-17", component: AllItemsComponent },
      { path: "all-items/cat-3/sub-cat-18", component: AllItemsComponent },
      { path: "all-items/cat-3/sub-cat-19", component: AllItemsComponent },
      { path: "all-items/cat-3/sub-cat-20", component: AllItemsComponent },
      { path: "all-items/cat-4/sub-cat-21", component: AllItemsComponent },
      { path: "all-items/cat-4/sub-cat-22", component: AllItemsComponent },
      { path: "all-items/cat-4/sub-cat-23", component: AllItemsComponent },
      { path: "all-items/cat-4/sub-cat-24", component: AllItemsComponent },
      { path: "all-items/cat-4/sub-cat-25", component: AllItemsComponent },
      { path: "all-items/cat-4/sub-cat-26", component: AllItemsComponent },
      { path: "all-items/cat-5/sub-cat-27", component: AllItemsComponent },
      { path: "all-items/cat-5/sub-cat-28", component: AllItemsComponent },
      { path: "all-items/cat-5/sub-cat-29", component: AllItemsComponent },
      { path: "all-items/cat-5/sub-cat-30", component: AllItemsComponent },
      { path: "all-items/cat-6/sub-cat-31", component: AllItemsComponent },
      { path: "all-items/cat-6/sub-cat-32", component: AllItemsComponent },
      { path: "all-items/cat-6/sub-cat-33", component: AllItemsComponent },
      { path: "all-items/cat-6/sub-cat-34", component: AllItemsComponent },
      { path: "all-items/cat-6/sub-cat-35", component: AllItemsComponent },
      { path: "all-items/cat-6/sub-cat-36", component: AllItemsComponent },
      { path: "all-items/cat-6/sub-cat-37", component: AllItemsComponent },
      { path: "all-items/cat-7/sub-cat-38", component: AllItemsComponent },
      { path: "all-items/cat-7/sub-cat-39", component: AllItemsComponent },
      { path: "all-items/cat-7/sub-cat-40", component: AllItemsComponent },
      { path: "all-items/cat-7/sub-cat-41", component: AllItemsComponent },
      { path: "all-items/cat-8/sub-cat-42", component: AllItemsComponent },
      { path: "all-items/cat-8/sub-cat-43", component: AllItemsComponent },
      { path: "all-items/cat-8/sub-cat-44", component: AllItemsComponent },
      { path: "all-items/cat-8/sub-cat-45", component: AllItemsComponent },
      { path: "all-items/cat-8/sub-cat-46", component: AllItemsComponent },

    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
