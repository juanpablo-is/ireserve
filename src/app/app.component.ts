import { Component } from '@angular/core';
import { UpdateToastService } from './update-toast.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent {

  title = 'IReserve';
  toast: any;

  constructor(private toastService: UpdateToastService) {
    this.toastService.getData()
      .subscribe(data => {
        this.toast = data;
        setTimeout(() => {
          delete this.toast;
        }, (data.seconds || 4) * 1000);
      });
  }

}
