import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'colfilter'
})
export class ColfilterPipe implements PipeTransform {

  transform(value: any, args?: any): any {

    var filter_type = args[0];
    var filter_val = args[1];

    if (!filter_type) {
      filter_type = '';
    }
    if (!filter_val) {
      filter_val = '';
    }

    if (filter_type === 'skillSelection' || filter_type === 'skillMaster') {
      return value.filter(function (el: any) {
        return (
          el.name.toLowerCase().indexOf(filter_val.toLowerCase()) > -1
        );
      });
    }
    else {
      return null;
    }
  }

}
