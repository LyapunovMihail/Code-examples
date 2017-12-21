import {Pipe, PipeTransform} from '@angular/core';
@Pipe({name: 'percentsOf'})
export class FilterPercents implements PipeTransform {
  transform(value: number, sum: number): any {
    return Math.round((value * 100) / sum) || '< 1';
  }
}