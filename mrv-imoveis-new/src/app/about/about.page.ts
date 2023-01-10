import { Component } from '@angular/core';

@Component({
  selector: 'app-about',
  templateUrl: 'about.page.html',
  styleUrls: ['about.page.scss']
})
export class AboutPage {
  test = "oi";
  constructor() { }

  Teste() {
    console.log(this.test);
  }

}
