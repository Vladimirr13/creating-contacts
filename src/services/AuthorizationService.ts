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
      setToken: action,
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

  setToken = (token: string) => {
    if (token.length) {
      localStorage.setItem('token', token);
    }
  };

  authUser = async (userData: IAuthUserData): Promise<IAuthUserData> => {
    try {
      const infoUser = await authorization(userData);
      if (infoUser?.token?.length) {
        this.setToken(infoUser.token);
      }
      return infoUser;
    } catch (e) {
      throw e;
    }
  };
}

export default new AuthorizationService();
