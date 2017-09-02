import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { TransactionPage } from '../transaction/transaction';
import { DatabaseProvider } from '../../providers/database/database';

/**
 * Generated class for the OverviewPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
    selector: 'page-overview',
    templateUrl: 'overview.html',
    providers: [DatabaseProvider],
})
export class OverviewPage {

    _db: any;

    constructor(public navCtrl: NavController, public navParams: NavParams, private db: DatabaseProvider) {
        this._db = db;
    }

    ionViewDidLoad() {
    }

    openTransaction() {
        this.navCtrl.push(TransactionPage, {
            tabs: "expense"
        });
    }

}
