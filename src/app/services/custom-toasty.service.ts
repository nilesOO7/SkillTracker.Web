import { Injectable } from '@angular/core';
import { ToastyService, ToastyConfig, ToastOptions, ToastData } from 'ng2-toasty';

@Injectable()
export class CustomToastyService {

    constructor(private toastyService: ToastyService, private toastyConfig: ToastyConfig) {
        // Assign the selected theme name to the `theme` property of the instance of ToastyConfig. 
        // Possible values: default, bootstrap, material

        // this.toastyConfig.theme = 'material';
        // this.toastyConfig.position = 'center-center';
    }

    showMessage(type: string, message: string) {

        var toastOptions: ToastOptions = {
            title: '',
            msg: message,
            showClose: true,
            timeout: 2000,
            theme: 'material'
        };

        if (type === 'success') {
            this.toastyService.success(toastOptions);
        }
        else if (type === 'error') {
            this.toastyService.error(toastOptions);
        }
        else if (type === 'warning') {
            this.toastyService.warning(toastOptions);
        }
        else {
            this.toastyService.info(toastOptions);
        }
    }
}
