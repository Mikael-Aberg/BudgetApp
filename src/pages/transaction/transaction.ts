import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';

/**
 * Generated class for the TransactionPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
    selector: 'page-transaction',
    templateUrl: 'transaction.html',
})
export class TransactionPage {

    tabs = "";
    transactionAmmount = "";
    tmpTransactionAmmount = "";
    calculateAction = "";
    wrapperHeight: number;

    constructor(public navCtrl: NavController, public navParams: NavParams, translate: TranslateService) {
        translate.setDefaultLang('en');
    }

    calcAction(value) {
        if (this.calculateAction !== "" && this.tmpTransactionAmmount !== "") {
            this.calculate();
            this.calculateAction = value;
            this.tmpTransactionAmmount = "";
        }
        else {
            this.calculateAction = value;
        }
    }

    append(value) {
        if (this.calculateAction !== "") {
            this.tmpTransactionAmmount += value;
        }
        else {
            if (this.transactionAmmount == "0") {
                this.transactionAmmount = value;
            } else {
                this.transactionAmmount += value;
            }
        }
        this.resizeText();
    }

    remove() {
        if (this.tmpTransactionAmmount.length > 1) {
            this.tmpTransactionAmmount = this.tmpTransactionAmmount.slice(0, this.tmpTransactionAmmount.length - 1);
        }
        else if (this.tmpTransactionAmmount.length == 1) {
            this.tmpTransactionAmmount = "";
        }
        else if (this.calculateAction !== "") {
            this.calculateAction = "";
        }
        else if (this.transactionAmmount.length > 1) {
            this.transactionAmmount = this.transactionAmmount.slice(0, this.transactionAmmount.length - 1);
        }
        else {
            this.transactionAmmount = "0";
        }
        this.resizeText();
    }

    calculate() {
        if (this.calculateAction !== "" && this.tmpTransactionAmmount !== "") {
            this.transactionAmmount = Math.round((eval(this.transactionAmmount + this.calculateAction + this.tmpTransactionAmmount) * 100) / 100).toString();
            this.calculateAction = "";
            this.tmpTransactionAmmount = "";
        }
        else {
            this.calculateAction = "";
        }
        this.resizeText();
    }

    resizeText() {
        if ((this.transactionAmmount.length + this.tmpTransactionAmmount.length + this.calculateAction.length) > 1) {
            document.getElementById("transaction-numbers").style.fontSize = (this.wrapperHeight / (this.transactionAmmount.length + this.tmpTransactionAmmount.length + this.calculateAction.length) * 1.5) + "px";
        }
        else {
            document.getElementById("transaction-numbers").style.fontSize = (this.wrapperHeight / (this.transactionAmmount.length + this.tmpTransactionAmmount.length + this.calculateAction.length)) + "px";
        }
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad TransactionPage');
        this.wrapperHeight = +document.getElementById("transaction-number-wrappers").scrollWidth;
        document.getElementById("transaction-icon").style.lineHeight = this.wrapperHeight + "px";
        document.getElementById("transaction-currency").style.lineHeight = this.wrapperHeight + "px";
        document.getElementById("transaction-numbers").style.lineHeight = this.wrapperHeight + "px";
        this.resizeText();
    }
}
