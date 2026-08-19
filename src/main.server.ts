import { BootstrapContext, bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';
import { config } from './app/app.config.server';

/**
 * Entry point used only at build time. Every route is rendered to a static
 * HTML file; nothing here runs in production, because GitHub Pages just
 * serves the files that come out.
 *
 * Angular 22 requires the BootstrapContext to be threaded through — without
 * it the renderer has no platform and route extraction fails with NG0401.
 */
const bootstrap = (context: BootstrapContext) => bootstrapApplication(App, config, context);

export default bootstrap;
