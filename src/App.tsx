import React, { ReactChild } from "react";
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import { StoreContext, useStoreon } from "storeon/react";
import { store } from "./store";
import { UserEvents, UserState } from "./store/user";
import SignIn from "./pages/SignIn";

type PrivateRouteProps = {
  children: ReactChild;
  path: string;
};

function PrivateRoute({ children, ...rest }: PrivateRouteProps) {
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
  return (
    <StoreContext.Provider value={store}>
      <Router>
        <Switch>
          <Route path="/sign-in">
            <SignIn />
          </Route>
          <Route path="/sign-up">sign up</Route>
          <PrivateRoute path="/">records</PrivateRoute>
          <PrivateRoute path="/clients">clients</PrivateRoute>
        </Switch>
      </Router>
    </StoreContext.Provider>
  );
}

export default App;
