import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { Sql } from '../../providers/database/Sql';

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
    transactionAmmount = "0";
    tmpTransactionAmmount = "";
    calculateAction = "";
    wrapperHeight: number;
    categories: any;
    transaction = {
        category: "",
    };
    slideoptions: {
        pager: true,
        autoHeight: true
    };

    constructor(public navCtrl: NavController, public navParams: NavParams, translate: TranslateService, sql: Sql) {
        translate.setDefaultLang('en');
        this.tabs = navParams.get("tabs") ? navParams.get("tabs") : "income";
        sql.getCategories().then((val) => this.categories = val);
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
        this.resizeText();
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

            switch (this.calculateAction) {
                case "+":
                    this.transactionAmmount = (Number(this.transactionAmmount) + Number(this.tmpTransactionAmmount)).toFixed(2).toString();
                    break;
                case "-":
                    this.transactionAmmount = (Number(this.transactionAmmount) - Number(this.tmpTransactionAmmount)).toFixed(2).toString();
                    break;
                case "*":
                    this.transactionAmmount = (Number(this.transactionAmmount) * Number(this.tmpTransactionAmmount)).toFixed(2).toString();
                    break;
                case "/":
                    this.transactionAmmount = (Number(this.transactionAmmount) / Number(this.tmpTransactionAmmount)).toFixed(2).toString();
                    break;
            }

            if (this.transactionAmmount.charAt(0) == "-") {
                this.transactionAmmount = "0";
            }
            this.calculateAction = "";
            this.tmpTransactionAmmount = "";
        }
        else {
            this.calculateAction = "";
        }
        this.resizeText();
    }

    resizeText() {
        if ((this.transactionAmmount.length + this.tmpTransactionAmmount.length + this.calculateAction.length) > 2) {
            document.getElementById("transaction-numbers").style.fontSize = (this.wrapperHeight / (this.transactionAmmount.length + this.tmpTransactionAmmount.length + this.calculateAction.length) * 1.5) + "px";
        }
        else {
            document.getElementById("transaction-numbers").style.fontSize = (this.wrapperHeight / (1.5)) + "px";
        }
    }

    openDetails() {
        console.log("Click");
    }

    ionViewDidLoad() {
        this.wrapperHeight = +document.getElementById("transaction-number-wrappers").scrollWidth;
        document.getElementById("transaction-icon").style.lineHeight = this.wrapperHeight + "px";
        document.getElementById("transaction-currency").style.lineHeight = this.wrapperHeight + "px";
        document.getElementById("transaction-numbers").style.lineHeight = this.wrapperHeight + "px";
        this.resizeText();
    }
}
