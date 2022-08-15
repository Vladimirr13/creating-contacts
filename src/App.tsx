import React, { useEffect } from 'react';
import { Router, Switch, Route } from 'react-router-dom';
import { RoutesEnum } from './routes';
import Authorization from './pages/Authorization';
import PrivateRoute from './pages/PrivateRoute';
import Home from './pages/Home';
import AuthorizationService from './services/AuthorizationService';
import LoggedInEventSubscriptionService from './services/LoggedInEventSubscriptionService';
import HistoryService from './services/HistoryService';
import Layout from './components/Layout';
import { ToastContainer } from 'react-toastify';
import NotFoundPage from './pages/NotFoundPage';

const App: React.FC = () => {
  const { loggedIn, initLoggedIn } = AuthorizationService;
  useEffect(() => {
    LoggedInEventSubscriptionService.subscribe();
    if (loggedIn) {
      initLoggedIn();
    }
    return () => {
      LoggedInEventSubscriptionService.unsubscribe();
    };
  }, []);
  return (
    <>
      <Router history={HistoryService.history}>
        <Layout>
          <Switch>
            <Route path={RoutesEnum.LOGIN} exact={true} component={Authorization} />
            <PrivateRoute path={RoutesEnum.MAIN} exact={true} component={Home} />
            <PrivateRoute path="*" component={NotFoundPage} />
          </Switch>
        </Layout>
      </Router>
      <ToastContainer
        position="top-right"
        autoClose={1000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={true}
        pauseOnFocusLoss={true}
        pauseOnHover={true}
      />
    </>
  );
};

export default App;
