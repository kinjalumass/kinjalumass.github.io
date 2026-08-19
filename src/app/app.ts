import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ImageGuard } from './core/image-guard';
import { Seo } from './core/seo';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  constructor() {
    inject(ImageGuard).install();
    // Keeps title, description, canonical and social tags in step with the route.
    inject(Seo).watchRoutes();
  }
}
