import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { TransactionPage } from '../transaction/transaction';
import { Sql } from '../../providers/database/Sql';

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

    transactions: any;

    constructor(public navCtrl: NavController, public navParams: NavParams, private sql: Sql) {
    }

    ionViewWillEnter() {
    }

    ionViewDidLoad() {
        this.sql.getTransactions().then((val) => {
            this.transactions = [];
            for (var i = 0; i < val.length; i++) {
                this.transactions[i] = val.item(i);
                this.transactions[i].selected = (i == 0) ? true : false;
            }
        });
    }

    openTransaction() {
        this.navCtrl.push(TransactionPage, {
            tabs: "expense"
        });
    }
}
