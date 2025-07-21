import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthTestComponent } from './auth-test/auth-test.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, AuthTestComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('frontend');
}
