import { Component } from '@angular/core';
import { CachingService } from './components/dashboard/cache.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'angular-cordova';

  constructor() {
  }
}
