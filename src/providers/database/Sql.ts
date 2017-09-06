import { Injectable } from "@angular/core";
import { Platform } from "ionic-angular";

const DB_NAME: string = 'mydb';
const win: any = window;

@Injectable()
export class Sql {
    private _dbPromise: Promise<any>;

    constructor(public platform: Platform) {
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
                reject({ err: err });
            }
        });
        this._tryInit();
    }

    // Initialize the DB with our required tables
    _tryInit() {
        this.query('CREATE TABLE IF NOT EXISTS Account ('
            + 'ID integer PRIMARY KEY,'
            + 'Title text NOT NULL,'
            + 'Ammount real NOT NULL)').catch(err => {
                console.error('Storage: Unable to create initial storage tables', err.tx, err.err);
            });

        this.query('CREATE TABLE IF NOT EXISTS Transaction_post ('
            + 'ID integer PRIMARY KEY,'
            + 'Title text NOT NULL,'
            + 'Ammount real NOT NULL,'
            + 'Account_ID integer NOT NULL,'
            + 'Timestamp real NOT NULL,'
            + 'FOREIGN KEY (Account_ID) REFERENCES Account (ID))').catch(err => {
                console.error('Storage: Unable to create initial storage tables', err.tx, err.err);
            });

        this.query('CREATE TABLE IF NOT EXISTS Category ('
            + 'ID integer PRIMARY KEY,'
            + 'Title text NOT NULL)').catch(err => {
                console.error('Storage: Unable to create initial storage tables', err.tx, err.err);
            });

        this.query('CREATE TABLE IF NOT EXISTS TransactionCategory ('
            + 'Transaction_post_ID,'
            + 'Category_ID,'
            + 'FOREIGN KEY (Transaction_post_ID) REFERENCES Transaction_post (ID),'
            + 'FOREIGN KEY (Category_ID) REFERENCES Category (ID),'
            + 'UNIQUE(Transaction_post_ID, Category_ID))').catch(err => {
                console.error('Storage: Unable to create initial storage tables', err.tx, err.err);
            });

        // INSERT & SELECT examples
        //this.query('INSERT INTO Account (Title, Ammount) VALUES ("Account 1", 200)');
        this.query('INSERT INTO Category (Title) VALUES ("Food")');
        this.query('INSERT INTO Category (Title) VALUES ("Housing")');

        //this.query('INSERT OR IGNORE INTO TransactionCategory (Transaction_post_ID, Category_ID) VALUES (1, 2)');
        //this.query('INSERT OR IGNORE INTO TransactionCategory (Transaction_post_ID, Category_ID) VALUES (2, 1)');

        //this.query('INSERT INTO Transaction_post (Title, Ammount, Account_ID, Timestamp) VALUES ("Post 1", 123, 1, julianday("2017-01-01 10:00:00"))');
        //this.query('SELECT Title, Ammount, date(Timestamp) as Date, time(Timestamp) as Time FROM Transaction_post').then((val) => { console.log(val.res.rows); }).catch((err) => { console.log(err); });

        //this.query('SELECT Transaction_post.*, Category.Title as Category FROM Transaction_post JOIN TransactionCategory ON (Transaction_post.ID = Transaction_post_ID AND TransactionCategory.Category_ID = 1)'
        //    + 'JOIN Category ON (TransactionCategory.Category_ID = Category.ID)').then((val) => { console.log(val.res.rows); }).catch((err) => { console.log(err); });

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
    query(query: string, params: any[] = []): Promise<any> {
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
                reject({ err: err });
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
