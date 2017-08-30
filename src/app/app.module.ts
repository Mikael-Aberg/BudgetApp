import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { TransactionPage } from '../pages/transaction/transaction';
import { PipesModule } from '../pipes/pipes.module'
import { MyApp } from './app.component';

@NgModule({
    declarations: [
        MyApp,
        TransactionPage,
    ],
    imports: [
        BrowserModule,
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
