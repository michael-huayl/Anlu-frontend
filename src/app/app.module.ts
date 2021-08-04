import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { LoggerModule } from 'ngx-logger';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
//import { HomeComponent } from './share/home/home.component';
import { ReaderModule } from './reader/reader.module';
import { httpInterceptorProviders } from './http-Intercepters/index';
import { BookModule } from './book/book.module';
import { HttpErrorHandler } from './common/http-error-handler.service';
import { ReaderAuthService } from './auth/reader-auth.service';
import { LibrarianAuthService } from './auth/librarian-auth.service';
import { AdminAuthService } from './auth/admin-auth.service';
import { environment } from 'src/environments/environment';
import { ShareModule } from './share/share.module';
import { WorkshopModule } from './workshop/workshop.module';
import { BlogModule } from './blog/blog.module';


@NgModule({
  declarations: [
    AppComponent,
    PageNotFoundComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ReaderModule,
    BookModule,
    WorkshopModule,
    BlogModule,
    ShareModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    LoggerModule.forRoot({
      level: environment.logLevel,
      serverLogLevel: environment.serverLogLevel,
      serverLoggingUrl: `${environment.apiUrl}api/log`,
      disableConsoleLogging: false,
    }),
  ],
  providers: [
    httpInterceptorProviders,
    HttpErrorHandler,
    ReaderAuthService,
    LibrarianAuthService,
    AdminAuthService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
