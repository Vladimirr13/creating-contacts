import { action, makeObservable, observable, runInAction } from "mobx";
import { getAuthorizedUser } from "../api/actions/authorization";
import { IAuthUserData, IGetAuthUsers } from "../api/interfaces/IAuthorization";

class AuthorizationService {
  userInfo: IAuthUserData | null;

  constructor() {
    makeObservable(this, {
      userInfo: observable,
      getUserInfo: action,
      setUserInfo: action,
      clearUser: action
    });
    this.userInfo = null;
  }

  setUserInfo = (userData: IAuthUserData): void => {
    console.log(userData);
    runInAction(() => {
      this.userInfo = userData;
    });
  };
  getUserInfo = async (userInfo: IGetAuthUsers): Promise<IAuthUserData[]> => {
    try {
      const userData = await getAuthorizedUser({
        ...userInfo
      });
      if (userData.length) {
        this.setUserInfo(userData[0]);
        return userData;
      } else {
        return [];
      }
    } catch (e) {
      throw e;
    }
  };
  clearUser = () => {
    runInAction(() => {
      this.userInfo = null;
    });
  };
}

export default new AuthorizationService();
