import { Pipe, PipeTransform, Injectable } from '@angular/core';

/**
 * Generated class for the TransactioniconPipe pipe.
 *
 * See https://angular.io/docs/ts/latest/guide/pipes.html for more info on
 * Angular Pipes.
 */
@Pipe({
    name: 'icon',
    pure: false,
})
@Injectable()
export class IconPipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  transform(value: string, ...args) {
      switch (value) {
          case "transfer":
              return "swap";
          case "cost":
              return "add";
          case "expense":
              return "remove";
          default:
              return "";
      }
  }
}
