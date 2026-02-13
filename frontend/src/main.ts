import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { AppComponent } from './app/app';
import { routes } from './app/app.routes';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient()
  ]
<<<<<<< HEAD
}).catch(err => console.error(err));
=======
}).catch(err => console.error(err));
>>>>>>> 66480723aebd8db20bbe3ac11e8ffaa80a28ed05
