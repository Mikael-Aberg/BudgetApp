import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { TransactionPage } from '../transaction/transaction';

/**
 * Generated class for the OverviewPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
    selector: 'page-overview',
    templateUrl: 'overview.html'
})
export class OverviewPage {

    constructor(public navCtrl: NavController, public navParams: NavParams) {
    }

    ionViewDidLoad() {
    }

    openTransaction() {
        this.navCtrl.push(TransactionPage, {
            tabs: "expense"
        });
    }
}
