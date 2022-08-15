import { createBrowserHistory, History } from 'history';
import { makeObservable, observable } from 'mobx';

type THistory = History;

class HistoryService {
  history: THistory;

  constructor() {
    makeObservable(this, {
      history: observable,

    });
    this.history = createBrowserHistory();
  }
}

export default new HistoryService();
