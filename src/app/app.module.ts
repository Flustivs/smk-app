import { NgModule } from '@angular/core';
import {
  BrowserModule,
  provideClientHydration,
} from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomePageComponent } from './home-page/home-page.component';
import { RouterModule } from '@angular/router';
import { ThemePageComponent } from './theme-page/theme-page.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { SearchPageComponent } from './search-page/search-page.component';
import { FormsModule } from '@angular/forms';
import { SmkService } from './smk.service';

@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    ThemePageComponent,
    NavBarComponent,
    SearchPageComponent,
  ],
  imports: [BrowserModule, RouterModule, FormsModule, AppRoutingModule],
  providers: [provideClientHydration(), SmkService],
  bootstrap: [AppComponent],
})
export class AppModule {}
