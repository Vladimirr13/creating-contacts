import React, { FunctionComponent } from 'react';
import { RouteProps, Route, Redirect } from 'react-router-dom';
import { RoutesEnum } from '../routes';
import AuthorizationService from '../services/AuthorizationService';
import { observer } from 'mobx-react';

const PrivateRoute: FunctionComponent<RouteProps> = ({ component: Component, ...rest }) => {
  const { loggedIn } = AuthorizationService;
  return (
    <Route
      {...rest}
      render={(props) =>
        loggedIn ? (
          // @ts-ignore
          <Component {...props} />
        ) : (
          <Redirect to={RoutesEnum.LOGIN} />
        )
      }
    />
  );
};

export default observer(PrivateRoute);
