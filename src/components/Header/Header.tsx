import React from 'react';
import AuthorizationService from '../../services/AuthorizationService';
import UserService from '../../services/UserService';
import { observer } from 'mobx-react';

const Header: React.FC = () => {
  const { userLogout } = AuthorizationService;
  const { userInfo } = UserService;
  return (
    <div className="header">
      <div className="header__user-name">
        Привет<span> {userInfo?.name}</span> !!!
      </div>
      <button onClick={userLogout} className="main-button">
        Выход
      </button>
    </div>
  );
};

export default observer(Header);
