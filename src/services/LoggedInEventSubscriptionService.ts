import { IReactionDisposer, reaction } from 'mobx';
import AuthorizationService from './AuthorizationService';
import HistoryService from './HistoryService';
import { RoutesEnum } from '../routes';

class LoggedInEventSubscriptionService {
  disposerChangeLoggedIn: IReactionDisposer | undefined;

  subscribe(): void {
    this.disposerChangeLoggedIn = reaction<boolean>(
      () => AuthorizationService.loggedIn,
      (loggedIn) => {
        if (loggedIn) {
          HistoryService.history.push(RoutesEnum.MAIN);
        }
      },
    );
  }

  unsubscribe(): void {
    if (this.disposerChangeLoggedIn) {
      this.disposerChangeLoggedIn();
    }
  }
}

export default new LoggedInEventSubscriptionService();
