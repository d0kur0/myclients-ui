import React from "react";
import { Snackbar, useMediaQuery, useTheme } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { useStoreon } from "storeon/react";
import { Events, State } from "../store";
import useErrorAlertStyles from "../styles/errorAlert";

const ErrorsHandler = () => {
  const { dispatch, errors } = useStoreon<State, Events>("errors");
  const classes = useErrorAlertStyles();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <>
      {Boolean(errors.length) && (
        <Snackbar
          anchorOrigin={{ vertical: "top", horizontal: isMobile ? "center" : "left" }}
          open={true}
          autoHideDuration={6000}
          onClose={() => dispatch("common/setErrors", [])}>
          <div className={classes.root}>
            {errors.map((error, key) => (
              <Alert
                className={classes.alert}
                elevation={3}
                key={key}
                variant="filled"
                onClose={() => dispatch("common/removeErrorByKey", key)}
                severity="error">
                {error}
              </Alert>
            ))}
          </div>
        </Snackbar>
      )}
    </>
  );
};

export default ErrorsHandler;
