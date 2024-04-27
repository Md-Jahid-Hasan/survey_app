import {ApplicationConfig} from '@angular/core';
import {provideRouter} from '@angular/router';

import {routes} from './app.routes';
import {withInterceptors, provideHttpClient} from "@angular/common/http";
import {provideClientHydration} from '@angular/platform-browser';
import {apiInterceptorInterceptor} from "./api-interceptor.interceptor";

export const appConfig: ApplicationConfig = {
    providers: [provideRouter(routes), provideClientHydration(),
        provideHttpClient(withInterceptors([apiInterceptorInterceptor]))
    ]
};
