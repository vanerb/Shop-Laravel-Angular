import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs';
import { LoadingService } from './loading-service';

export const loadingInterceptor: HttpInterceptorFn = (request, next) => {
  const finishLoading = inject(LoadingService).beginRequest();
  return next(request).pipe(finalize(finishLoading));
};
