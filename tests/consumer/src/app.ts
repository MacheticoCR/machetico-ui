import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
/**
 * Isolated routed shell used by the production AOT and SSR consumer regression.
 * @class App
 */
@Component({
  selector: 'smoke-app',
  imports: [RouterOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './app.html',
})
export class App {}
