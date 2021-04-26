import React, { ReactChild, useEffect, useMemo } from "react";
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import { StoreContext, useStoreon } from "storeon/react";
import { Events, State, store } from "./store";
import { UserEvents, UserState } from "./store/user";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import ServiceView from "./pages/services/ServiceView";
import Header from "./components/Header";
import { useLocation, useTitle } from "react-use";
import {
  createMuiTheme,
  CssBaseline,
  useMediaQuery,
  ThemeProvider,
} from "@material-ui/core";
import ErrorsHandler from "./components/ErrorsHandler";
import ClientView from "./pages/clients/ClientView";
import ClientCreate from "./pages/clients/ClientCreate";
import ClientUpdate from "./pages/clients/ClientUpdate";
import ServiceCreate from "./pages/services/ServiceCreate";
import ServiceUpdate from "./pages/services/ServiceUpdate";
import RecordView from "./pages/records/RecordView";

type RouteProps = {
  children: ReactChild;
  path: string;
};

export type PageProps = {
  title: string;
  isNeedSearch?: boolean;
  component?: ReactChild;
};

const PageWrapper = ({ title, component, isNeedSearch }: PageProps) => {
  const { isAuth, dispatch } = useStoreon<State, Events>("isAuth");
  const location = useLocation();
  useTitle(title);

  useEffect(() => {
    dispatch("common/setPending", false);
    dispatch("common/setErrors", []);
    dispatch("common/setSuccess", false);
    dispatch("globalSearch/setQuery", "");
    dispatch("clients/fetch");
    dispatch("services/fetch");
  }, [location, dispatch]);

  return (
    <>
      {isAuth && <Header isNeedSearch={isNeedSearch} title={title} />}
      {component}
    </>
  );
};

function NonAuthRoute({ children, ...rest }: RouteProps) {
  const { isAuth } = useStoreon<UserState, UserEvents>("isAuth");

  return (
    <Route
      {...rest}
      render={({ location }) =>
        !isAuth ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/",
              state: { from: location },
            }}
          />
        )
      }
    />
  );
}

function PrivateRoute({ children, ...rest }: RouteProps) {
  const { isAuth } = useStoreon<UserState, UserEvents>("isAuth");

  return (
    <Route
      {...rest}
      render={({ location }) =>
        isAuth ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/sign-in",
              state: { from: location },
            }}
          />
        )
      }
    />
  );
}

function App() {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  const theme = useMemo(
    () =>
      createMuiTheme({
        palette: {
          type: prefersDarkMode ? "dark" : "light",
          primary: {
            main: "#ff80ab",
          },
          secondary: {
            main: "#ff80ab",
          },
        },
      }),
    [prefersDarkMode]
  );

  return (
    <StoreContext.Provider value={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <ErrorsHandler />
        <Router>
          <Switch>
            <NonAuthRoute path="/sign-in">
              <PageWrapper title="Авторизация" component={<SignIn />} />
            </NonAuthRoute>
            <NonAuthRoute path="/sign-up">
              <PageWrapper title="Регистрация" component={<SignUp />} />
            </NonAuthRoute>

            <PrivateRoute path="/clients/update/:clientID">
              <PageWrapper title="Изменение клиента" component={<ClientUpdate />} />
            </PrivateRoute>
            <PrivateRoute path="/clients/create">
              <PageWrapper title="Добавление клиента" component={<ClientCreate />} />
            </PrivateRoute>
            <PrivateRoute path="/clients">
              <PageWrapper
                isNeedSearch={true}
                title="Мои клиенты"
                component={<ClientView />}
              />
            </PrivateRoute>

            <PrivateRoute path="/services/update/:serviceID">
              <PageWrapper title="Добавление услуги" component={<ServiceUpdate />} />
            </PrivateRoute>
            <PrivateRoute path="/services/create">
              <PageWrapper title="Добавление услуги" component={<ServiceCreate />} />
            </PrivateRoute>
            <PrivateRoute path="/services">
              <PageWrapper
                isNeedSearch={true}
                title="Мои услуги"
                component={<ServiceView />}
              />
            </PrivateRoute>

            <PrivateRoute path="/">
              <PageWrapper
                isNeedSearch={false}
                title="Мои записи"
                component={<RecordView />}
              />
            </PrivateRoute>
          </Switch>
        </Router>
      </ThemeProvider>
    </StoreContext.Provider>
  );
}

export default App;
