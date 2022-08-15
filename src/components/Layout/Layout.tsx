import React from 'react';
import Header from '../Header';
import AuthorizationService from '../../services/AuthorizationService';
import { observer } from 'mobx-react';

interface ILayoutProps {
  children: JSX.Element[] | JSX.Element;
}

const Layout: React.FC<ILayoutProps> = ({ children }) => {
  const { loggedIn } = AuthorizationService;
  return (
    <div className="main-wrapper">
      {loggedIn && <Header />}
      {children}
    </div>
  );
};
export default observer(Layout);
