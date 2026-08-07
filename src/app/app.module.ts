import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';

import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';

import { PagesModule } from './pages/pages.module';
import { AuthModule } from './auth/auth.module';

import { provideHttpClient, withFetch, withInterceptorsFromDi } from '@angular/common/http';

@NgModule({ declarations: [
        AppComponent
    ],
    bootstrap: [AppComponent],
    imports: [
        BrowserModule,
        AuthModule,
        PagesModule,
        //Siempre tiene que ir al final
        AppRoutingModule,
    ], 
    providers: [provideHttpClient(withFetch(), withInterceptorsFromDi())] 
    })
export class AppModule { }
