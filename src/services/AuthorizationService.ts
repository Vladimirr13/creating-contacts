import { action, computed, makeObservable, observable, runInAction } from 'mobx';
import { authorization } from '../api/actions/authorization';
import { IAuthUserData } from '../api/interfaces/IAuthorization';

class AuthorizationService {
  userIsAuthorized: boolean;

  constructor() {
    makeObservable(this, {
      userIsAuthorized: observable,
      initLoggedIn: action,
      userLogout: action,
      authUser: action,
      loggedIn: computed,
    });
    this.userIsAuthorized = false;
    this.initLoggedIn();
  }

  initLoggedIn = (): void => {
    const token = localStorage.getItem('token');
    runInAction(() => {
      this.userIsAuthorized = Boolean(token?.length);
    });
  };
  userLogout = (): void => {
    localStorage.removeItem('token');
    this.initLoggedIn();
  };

  get loggedIn(): boolean {
    return this.userIsAuthorized;
  }

  authUser = async (userData: IAuthUserData): Promise<IAuthUserData> => {
    try {
      const infoUser = await authorization(userData);
      if (infoUser?.token?.length) {
        localStorage.setItem('token', infoUser?.token);
      }
      return infoUser;
    } catch (e) {
      throw e;
    }
  };
}

export default new AuthorizationService();
