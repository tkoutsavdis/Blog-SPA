/*
  **************** basic imports ****************
*/
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from './guard/auth.guard';
import { unAuthGuard } from './un-guard/un-auth.guard';

/*
  **************** import components ****************
  Two main categories 
  1) Main website 
  2) Admin page (guard or un-guard required)
*/

import { PageNotFoundComponent } from './general/page-not-found/page-not-found.component';

// MAIN website imports
import { MainLayoutComponent } from './general/main-layout/main-layout.component';
import { LandingPageComponent } from './main-page/landing-page/landing-page/landing-page.component';
import { PublicationListPageComponent } from './main-page/publication-list-page/publication-list-page/publication-list-page.component';
import { PublicationComponent } from './main-page/publication/publication.component';
import { HistoryComponent } from './main-page/informations/history/history.component';
import { OrganizationComponent } from './main-page/informations/organization/organization.component';
import { SuggestionsComponent } from './main-page/informations/suggestions/suggestions.component';
import { ContactComponent } from './main-page/contact/contact.component';

// ADMIN page imports 
import { LoginFormComponent } from './admin-page/login-form/login-form.component';

import { AdminLayoutComponent } from './admin-page/admin-layout/admin-layout.component';
import { AdminHomeComponent } from './admin-page/admin-home/admin-home.component';
import { AdminInsertPublicationComponent } from './admin-page/admin-insert-publication/admin-insert-publication.component';
import { AdminEditPublicationComponent } from './admin-page/admin-edit-publication/admin-edit-publication.component';
import { AdminEditCarouselComponent } from './admin-page/admin-edit-carousel/admin-edit-carousel.component';
import { TestingPageComponent } from './testing-page/testing-page.component';

const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: '', component: LandingPageComponent},
      { path:'publicationsList', component: PublicationListPageComponent},
      {path: 'publication', component: PublicationComponent},
      {path: 'history', component: HistoryComponent},
      {path: 'organization', component: OrganizationComponent},
      {path: 'suggestions', component: SuggestionsComponent},
      {path: 'contact', component: ContactComponent},
      {path: 'testing', component: TestingPageComponent}
    ]
  },
  {
    path: 'admin-page',
    children: [
      {
        path: '',
        component: LoginFormComponent,
        canActivate: [unAuthGuard]
      },
      {
        path: '',
        component: AdminLayoutComponent,
        canActivate: [authGuard],
        children: [
          { path: 'home', component: AdminHomeComponent },
          { path: 'insert-publication', component: AdminInsertPublicationComponent },
          { path: 'edit-publication', component: AdminEditPublicationComponent },
          { path: 'edit-carousel', component: AdminEditCarouselComponent }
        ]
      }
    ]
  },
  {
    path: '**',
    component: PageNotFoundComponent
  }
];


@NgModule({
  imports: [
    RouterModule.forRoot(routes, { 
      scrollPositionRestoration: 'enabled',
      anchorScrolling: 'enabled',
      scrollOffset: [0, 0]
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }