import { ErrorHandler, Injectable, Injector } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

import { ErrorService } from './services/error.service';
import { NotificationService } from './services/notification.service';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  constructor(private injector: Injector) {}

  handleError(error: Error | HttpErrorResponse) {
    const errorService = this.injector.get(ErrorService);
    // const logger = this.injector.get(LoggingService);
    const notifier = this.injector.get(NotificationService);

    let message;
    // let stackTrace;
    if (error instanceof HttpErrorResponse) {
      // Server error
      message = errorService.getServerErrorMessage(error);
      // stackTrace = errorService.getServerErrorStackTrace(error);
      notifier.notify(message);
    } else {
      // Client Error
      message = errorService.getClientErrorMessage(error);
      notifier.notify(message);
    }
    // Always log errors
    // logger.logError(message, stackTrace);
    console.error(error);
  }
}
