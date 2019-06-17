import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})

export class FilterPipe implements PipeTransform {

  transform(value: any, args: any[])
    : any {

    var input_name = args[0];
    var input_id = args[1];
    var input_email = args[2];
    var input_mobile = args[3];
    var input_skill = args[4];

    if (!input_name) {
      input_name = '';
    }
    if (!input_id) {
      input_id = '';
    }
    if (!input_email) {
      input_email = '';
    }
    if (!input_mobile) {
      input_mobile = '';
    }
    if (!input_skill) {
      input_skill = '';
    }

    return value.filter(function (el: any) {
      return (
        el.name.toLowerCase().indexOf(input_name.toLowerCase()) > -1
        && String(el.id).toLowerCase().indexOf(input_id) > -1
        && el.email.toLowerCase().indexOf(input_email.toLowerCase()) > -1
        && el.mobile.toLowerCase().indexOf(input_mobile.toLowerCase()) > -1
        && el.strongSkills.toLowerCase().indexOf(input_skill.toLowerCase()) > -1
      );
    });

  }

}
