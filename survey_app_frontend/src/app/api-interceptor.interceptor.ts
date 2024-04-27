import {HttpInterceptorFn} from '@angular/common/http';

export const apiInterceptorInterceptor: HttpInterceptorFn = (req, next) => {

    if (localStorage.getItem('token')) {
        const authReq = req.clone({
            setHeaders: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        });
        return next(authReq);
    } else return next(req)
};
