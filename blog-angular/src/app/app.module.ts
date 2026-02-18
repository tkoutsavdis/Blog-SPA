// ******************** basic imports ********************
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LayoutModule } from '@angular/cdk/layout';
import { HttpClientModule,HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; 
import { AuthInterceptor } from './interceptor/auth.interceptor';
import { QuillModule } from 'ngx-quill';

// ******************** Angular Material ********************
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatRadioModule } from '@angular/material/radio';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { MatMenuModule } from '@angular/material/menu';
// ******************** Components ********************

// general re-usable components
import { MainLayoutComponent } from './general/main-layout/main-layout.component';
import { NavbarComponent } from './general/navbar/navbar.component';
import { FooterComponent } from './general/footer/footer.component';
import { PageNotFoundComponent } from './general/page-not-found/page-not-found.component';

// landing page components 
import { LandingPageComponent } from './main-page/landing-page/landing-page/landing-page.component';
import { LandingCarouselComponent } from './main-page/landing-page/landing-carousel/landing-carousel.component';
import { InformationPanelComponent } from './main-page/landing-page/information-panel/information-panel.component';

//Paging page components
import { PublicationListPanelComponent } from './main-page/publication-list-page/publication-list-panel/publication-list-panel.component';
import { PublicationListPageComponent } from './main-page/publication-list-page/publication-list-page/publication-list-page.component';

// speciffic publication page components
import { PublicationComponent } from './main-page/publication/publication.component';

// informations page components
import { HistoryComponent } from './main-page/informations/history/history.component';
import { OrganizationComponent } from './main-page/informations/organization/organization.component';
import { SuggestionsComponent } from './main-page/informations/suggestions/suggestions.component';


// admin page components 
import { LoginFormComponent } from './admin-page/login-form/login-form.component';
import { AdminLayoutComponent } from './admin-page/admin-layout/admin-layout.component';
import { AdminHomeComponent } from './admin-page/admin-home/admin-home.component';
import { AdminInsertPublicationComponent } from './admin-page/admin-insert-publication/admin-insert-publication.component';
import { AdminEditPublicationComponent } from './admin-page/admin-edit-publication/admin-edit-publication.component';
import { AdminEditCarouselComponent } from './admin-page/admin-edit-carousel/admin-edit-carousel.component';
import { PublicationPanelComponent } from './main-page/landing-page/publication-panel/publication-panel.component';
import { ContactComponent } from './main-page/contact/contact.component';
import { TestingPageComponent } from './testing-page/testing-page.component';

@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    NavbarComponent,
    LandingCarouselComponent,
    LandingPageComponent,
    PageNotFoundComponent,
    LoginFormComponent,
    AdminLayoutComponent,
    AdminHomeComponent,
    AdminInsertPublicationComponent,
    AdminEditPublicationComponent,
    AdminEditCarouselComponent,
    PublicationPanelComponent,
    InformationPanelComponent,
    MainLayoutComponent,
    PublicationListPanelComponent,
    PublicationListPageComponent,
    PublicationComponent,
    HistoryComponent,
    OrganizationComponent,
    SuggestionsComponent,
    ContactComponent,
    TestingPageComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    LayoutModule,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatListModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MatRadioModule,
    MatAutocompleteModule,
    NgbModule,
    MatMenuModule,
    QuillModule.forRoot()
  ],
  providers: [
    provideAnimationsAsync(),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor, 
      multi: true,
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }