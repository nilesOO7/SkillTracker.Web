import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { FormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { AddassociateComponent } from './components/addassociate/addassociate.component';
import { HomeComponent } from './components/home/home.component';
import { LoaderComponent } from './components/loader/loader.component';

import { Configuration } from './app.constants';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { CustomInterceptor } from './auth/request.interceptor';

import { FilterPipe } from './pipes/filter.pipe';
import { ColfilterPipe } from './pipes/colfilter.pipe';

import { ToastyModule } from 'ng2-toasty';
import { MatSliderModule } from '@angular/material/slider';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import { LoaderService } from './services/loader.service';

import 'hammerjs';

const appRoutes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'addAssociate', component: AddassociateComponent },
  { path: 'view/:id', component: AddassociateComponent },
  { path: 'edit/:id', component: AddassociateComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    FilterPipe,
    ColfilterPipe,
    AddassociateComponent,
    HomeComponent,
    LoaderComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    HttpClientModule,
    RouterModule.forRoot(appRoutes),
    ToastyModule.forRoot(),
    MatSliderModule,
    MatProgressBarModule
  ],
  providers: [
    Configuration,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: CustomInterceptor,
      multi: true
    },
    LoaderService
  ],
  bootstrap: [AppComponent]
})

export class AppModule { }
