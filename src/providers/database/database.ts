import { Injectable } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { Sql } from './Sql'
import 'rxjs/add/operator/map';

@Injectable()
export class DatabaseProvider {

    constructor(public http: HttpClientModule, private sql: Sql) {
        this.initialiseDB();
    }

    initialiseDB() {

    }
}
