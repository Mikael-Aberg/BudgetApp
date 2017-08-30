import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generated class for the CalculatePipe pipe.
 *
 * See https://angular.io/docs/ts/latest/guide/pipes.html for more info on
 * Angular Pipes.
 */
@Pipe({
  name: 'calculate',
})
export class CalculatePipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  transform(value: string, ...args) {
      return eval(value);
  }
}
