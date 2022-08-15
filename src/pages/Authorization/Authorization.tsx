import React, { useEffect, useState } from 'react';
import AuthorizationService from '../../services/AuthorizationService';
import HistoryService from '../../services/HistoryService';
import { RoutesEnum } from '../../routes';
import AuthorizationForm from './AuthorizationForm';
import RegisterForm from './RegisterForm';

const Authorization: React.FC = () => {
  const { loggedIn } = AuthorizationService;
  const { history } = HistoryService;
  const [statusAuthUser, setStatusAuthUser] = useState('auth');
  const changeStatusAuthUser = (): void => {
    if (statusAuthUser === 'auth') {
      setStatusAuthUser('register');
    } else {
      setStatusAuthUser('auth');
    }
  };

  useEffect(() => {
    if (loggedIn) {
      history.push(RoutesEnum.MAIN);
    }
  }, [loggedIn, history]);

  return (
    <div className="authorization">
      <div className="authorization__wrapper">
        {statusAuthUser === 'auth' && <AuthorizationForm />}
        {statusAuthUser === 'register' && <RegisterForm />}
        <div className="authorization__button">
          <button className="empty-button" onClick={changeStatusAuthUser}>
            {statusAuthUser === 'auth' ? 'Зарегистрироваться?' : 'Авторизоваться?'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Authorization;
