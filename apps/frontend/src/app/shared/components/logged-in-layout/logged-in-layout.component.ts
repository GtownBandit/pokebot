import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-logged-in-layout',
  imports: [RouterOutlet, HeaderComponent],
  templateUrl: './logged-in-layout.component.html',
  styleUrl: './logged-in-layout.component.scss',
})
export class LoggedInLayoutComponent {}
