import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { SpinnerService } from '../../../Services/spinner.service';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrl: './spinner.component.css'
})
export class SpinnerComponent {
  isVisible = false;
  private subscription: Subscription;

  constructor(private spinnerService: SpinnerService) {
    this.subscription = this.spinnerService.spinnerVisible$.subscribe(visible => {
      this.isVisible = visible;
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
