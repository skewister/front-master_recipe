import { Component } from '@angular/core';
import {faHeart} from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'front-master_recipe';
  faHeart = faHeart;
}
