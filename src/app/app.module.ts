import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import {Ng2FittextModule} from "ng2-fittext/ng2fittext";

import { TransactionPage } from '../pages/transaction/transaction';
import { PipesModule } from '../pipes/pipes.module'
import { MyApp } from './app.component';

export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http);
}

@NgModule({
    declarations: [
        MyApp,
        TransactionPage,
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        Ng2FittextModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient]
            }
        }),
        IonicModule.forRoot(MyApp),
        PipesModule,
    ],
    bootstrap: [IonicApp],
    entryComponents: [
        MyApp,
        TransactionPage,
    ],
    providers: [
        StatusBar,
        SplashScreen,

        { provide: ErrorHandler, useClass: IonicErrorHandler }
    ]
})
export class AppModule { }
