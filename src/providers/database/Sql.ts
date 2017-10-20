import { Injectable } from "@angular/core";
import { Platform } from "ionic-angular";
import { ToastController } from 'ionic-angular';

const DB_NAME: string = 'mydb';
const win: any = window;

@Injectable()
export class Sql {
    private _dbPromise: Promise<any>;

    constructor(public platform: Platform, public toastCtrl: ToastController) {
        this._dbPromise = new Promise((resolve, reject) => {
            try {
                let _db: any;
                this.platform.ready().then(() => {
                    if (this.platform.is('cordova') && win.sqlitePlugin) {
                        _db = win.sqlitePlugin.openDatabase({
                            name: DB_NAME,
                            location: 'default'
                        });
                        
                    } else {
                        console.warn('Storage: SQLite plugin not installed, falling back to WebSQL. Make sure to install cordova-sqlite-storage in production!');
                        _db = win.openDatabase(DB_NAME, '1.0', 'database', 5 * 1024 * 1024);
                    }
                    resolve(_db);
                });
            } catch (err) {
                console.log(err);
                reject({ err: err });
            }
        });
        this._tryInit();
    }
    
    presentToast(message: string) {
        const toast = this.toastCtrl.create({
          message: message,
          duration: 3000,
          position: 'top'
        });
      
        toast.onDidDismiss(() => {
          console.log('Dismissed toast');
        });
      
        toast.present();
      }



    // Initialize the DB with our required tables
    _tryInit() {
        this.query('CREATE TABLE IF NOT EXISTS "Category"('
            + '"ID" INTEGER PRIMARY KEY NOT NULL,'
            + '"Title" VARCHAR(45) NOT NULL,'
            + 'CONSTRAINT "ID_UNIQUE"'
            + 'UNIQUE("ID"))').catch(err => {
                console.error('Storage: Unable to create initial storage tables', err.tx, err.err);
            });

        this.query('CREATE TABLE IF NOT EXISTS "Account"('
            + '"ID" INTEGER PRIMARY KEY NOT NULL,'
            + '"Title" VARCHAR(45) NOT NULL,'
            + '"Ammount" INTEGER NOT NULL,'
            + 'CONSTRAINT "ID_UNIQUE"'
            + 'UNIQUE("ID"))').catch(err => {
                console.error('Storage: Unable to create initial storage tables', err.tx, err.err);
            });

        this.query('CREATE TABLE IF NOT EXISTS "Transaction_post"('
            + '"ID" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,'
            + '"Timestamp" REAL NOT NULL,'
            + '"Ammount" REAL NOT NULL,'
            + '"Description" TEXT,'
            + '"Account_ID" INTEGER NOT NULL,'
            + '"Category_ID" INTEGER NOT NULL,'
            + 'CONSTRAINT "fk_Transaction_post_Account"'
            + 'FOREIGN KEY("Account_ID")'
            + 'REFERENCES "Account"("ID"),'
            + 'CONSTRAINT "fk_Transaction_post_Category1"'
            + 'FOREIGN KEY("Category_ID")'
            + 'REFERENCES "Category"("ID"));').catch(err => {
                console.error('Storage: Unable to create initial storage tables', err.tx, err.err);
            });

        this.query('CREATE INDEX IF NOT EXISTS "Transaction_post.fk_Transaction_post_Account_idx" ON "Transaction_post" ("Account_ID");').catch(err => {
            console.error('Storage: Unable to create initial storage tables', err.tx, err.err);
        });

        this.query('CREATE INDEX IF NOT EXISTS "Transaction_post.fk_Transaction_post_Category1_idx" ON "Transaction_post" ("Category_ID");').catch(err => {
            console.error('Storage: Unable to create initial storage tables', err.tx, err.err);
        });

        this.query('INSERT INTO Account (Title, Ammount) VALUES ("Account 1", 200)');
        this.query('INSERT INTO Category (Title) VALUES ("Food")');
        //this.query('INSERT INTO Category (Title) VALUES ("Housing")');

        //this.query('INSERT INTO Transaction_post (Title, Ammount, Account_ID, Timestamp) VALUES ("Post 1", 123, 1, julianday("2017-01-01 10:00:00"))');
        //this.query('SELECT Title, Ammount, date(Timestamp) as Date, time(Timestamp) as Time FROM Transaction_post').then((val) => { console.log(val.res.rows); }).catch((err) => { console.log(err); });

        //this.query('SELECT * FROM Transaction_post WHERE Account_ID = 2').then((val) => { console.log(val.res.rows); }).catch((err) => { console.log(err); });
    }

    /**
     * Perform an arbitrary SQL operation on the database. Use this method
     * to have full control over the underlying database through SQL operations
     * like SELECT, INSERT, and UPDATE.
     *
     * @param {string} query the query to run
     * @param {array} params the additional params to use for query placeholders
     * @return {Promise} that resolves or rejects with an object of the form { tx: Transaction, res: Result (or err)}
     */
    private query(query: string, params: any[] = []): Promise<any> {
        return new Promise((resolve, reject) => {
            try {
                this._dbPromise.then(db => {
                    db.transaction((tx: any) => {
                        tx.executeSql(query, params,
                            (tx: any, res: any) => resolve({ tx: tx, res: res }),
                            (tx: any, err: any) => reject({ tx: tx, err: err }));
                    },
                        (err: any) => reject({ err: err }));
                });
            } catch (err) {
                this.presentToast(err);
                reject({ err: err });
            }
        });
    }

    addTransaction(timestamp: string, ammount: number, account_id: number, category_id: number, description: string, transactionType: string) {
        return this.query('INSERT INTO Transaction_post (Ammount, Account_ID, Timestamp, Category_ID) VALUES (' + ammount + ',' + account_id + ',julianday("' + timestamp + '"), ' + category_id + ')');
    }

    getTransactions() {
        return this.query('Select *, Date(Timestamp) as Date, Time(Timestamp) as Time from Transaction_post').then(data => {
            if (data.res.rows.length > 0) {
                return data.res.rows;
            }
            else {
                return null;
            }
        });
    }

    /**
     * Get the value in the database identified by the given key.
     * @param {string} key the key
     * @return {Promise} that resolves or rejects with an object of the form { tx: Transaction, res: Result (or err)}
     */
    get(key: string): Promise<any> {
        return this.query('select key, value from kv where key = ? limit 1', [key]).then(data => {
            if (data.res.rows.length > 0) {
                return data.res.rows.item(0).value;
            }
        });
    }

    /**
     * Get all the categoreis 
     * @return {Promise} with the rows of the categories 
     */
    getCategories() {
        return this.query('Select * from Category').then(data => {
            if (data.res.rows.length > 0) {
                return data.res.rows;
            }
        });
    }

    getAccounts() {
        return this.query('Select * from Account').then(data => {
            if(data.err != null){
                console.log(data.err);
            }
            if (data.res.rows.length > 0) {
                return data.res.rows;

            }
        });
    }

    /**
     * Set the value in the database for the given key. Existing values will be overwritten.
     * @param {string} key the key
     * @param {string} value The value (as a string)
     * @return {Promise} that resolves or rejects with an object of the form { tx: Transaction, res: Result (or err)}
     */
    set(key: string, value: string): Promise<any> {
        return this.query('insert or replace into kv(key, value) values (?, ?)', [key, value]);
    }

    getJson(key: string): Promise<any> {
        return this.get(key).then(value => {
            try {
                return JSON.parse(value);
            } catch (e) {
                throw e; // rethrowing exception so it can be handled with .catch()
            }
        });
    }

    setJson(key: string, value: any): Promise<any> {
        try {
            return this.set(key, JSON.stringify(value));
        } catch (e) {
            return Promise.reject(e);
        }
    }

    /**
     * Remove the value in the database for the given key.
     * @param {string} key the key
     * @return {Promise} that resolves or rejects with an object of the form { tx: Transaction, res: Result (or err)}
     */
    remove(key: string): Promise<any> {
        return this.query('delete from kv where key = ?', [key]);
    }

    /**
     * Clear all keys/values of your database.
     * @return {Promise} that resolves or rejects with an object of the form { tx: Transaction, res: Result (or err)}
     */
    clear(): Promise<any> {
        return this.query('delete from kv');
    }
}
