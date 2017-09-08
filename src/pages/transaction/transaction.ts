import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { Sql } from '../../providers/database/Sql';
import { ToastController } from 'ionic-angular';

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

    //TODO - Look in to ionic native date/time picker

    transactionAmmount = "0";
    tmpTransactionAmmount = "";
    calculateAction = "";
    wrapperHeight: number;
    categories: any;
    accounts: any;
    transaction = {
        category: -1,
        description: "",
        date: new Date().toISOString(),
        transactionType: "",
        account: -1,
        ammount: -1,
    };
    slideoptions: {
        pager: true,
        autoHeight: true
    };

    constructor(public navCtrl: NavController, public navParams: NavParams, translate: TranslateService, private sql: Sql, private toastCtrl: ToastController) {
        translate.setDefaultLang('en');
        this.transaction.transactionType = navParams.get("tabs") ? navParams.get("tabs") : "expense";
        sql.getCategories().then((val) => {
            this.categories = val;
            for (var i = 0; i < this.categories.length; i++) {
                this.categories[i].selected = (i == 0) ? true : false;
            }
            console.log(this.categories);
        });
        sql.getAccounts().then((val) => {
            this.accounts = val;
            for (var i = 0; i < this.accounts.length; i++) {
                this.accounts[i].selected = (i == 0) ? true : false;
            }
        });
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

    validate() {
        if (this.tmpTransactionAmmount.length != 0) {
            this.calculate();
            if (parseFloat(this.transactionAmmount) > 0) {
                this.transaction.ammount = parseFloat(this.transactionAmmount);
            }
            else {
                this.presentToast("Please enter an ammount");
                return;
            }
        }

        if (this.transaction.account < 0) {
            this.presentToast("Please select a account");
            return;
        }

        if (this.transaction.category < 0) {
            this.presentToast("Please select a category");
            return;
        }

        switch (this.transaction.transactionType) {

        }

        this.sql.addTransaction(this.transaction.date, this.transaction.ammount, this.transaction.account, this.transaction.category, this.transaction.description, this.transaction.transactionType);

    }

    presentToast(message) {
        let toast = this.toastCtrl.create({
            message: message,
            duration: 3000,
            position: 'middle'
        });

        toast.onDidDismiss(() => {
            console.log('Dismissed toast');
        });

        toast.present();
    }

    resizeText() {
        if ((this.transactionAmmount.length + this.tmpTransactionAmmount.length + this.calculateAction.length) > 2) {
            document.getElementById("transaction-numbers").style.fontSize = (this.wrapperHeight / (this.transactionAmmount.length + this.tmpTransactionAmmount.length + this.calculateAction.length) * 1.5) + "px";
        }
        else {
            document.getElementById("transaction-numbers").style.fontSize = (this.wrapperHeight / (1.5)) + "px";
        }
    }

    ionViewDidLoad() {
        this.wrapperHeight = +document.getElementById("transaction-number-wrappers").scrollWidth;
        document.getElementById("transaction-icon").style.lineHeight = this.wrapperHeight + "px";
        document.getElementById("transaction-currency").style.lineHeight = this.wrapperHeight + "px";
        document.getElementById("transaction-numbers").style.lineHeight = this.wrapperHeight + "px";
        this.resizeText();
    }
}
