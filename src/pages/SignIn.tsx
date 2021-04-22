import React, { useEffect } from "react";
import { useStoreon } from "storeon/react";
import { useHistory, Link as RouterLink } from "react-router-dom";
import { LockOutlined as LockOutlinedIcon } from "@material-ui/icons";
import { useFormik } from "formik";
import { SignInRequest } from "../Api";
import { Events, State } from "../store";
import {
  Container,
  makeStyles,
  Typography,
  Grid,
  Link,
  TextField,
  Button,
  Avatar,
} from "@material-ui/core";

const useStyles = makeStyles(theme => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%",
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const SignIn = () => {
  const { dispatch, isAuth } = useStoreon<State, Events>("isAuth");
  const classes = useStyles();
  const history = useHistory();
  const formik = useFormik<SignInRequest>({
    initialValues: {
      email: "",
      password: "",
    },
    onSubmit: values => dispatch("user/signIn", values),
  });

  useEffect(() => {
    isAuth && history.push("/");
  }, [isAuth, history]);

  return (
    <Container component="main" maxWidth="xs">
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Авторизация
        </Typography>
        <form onSubmit={formik.handleSubmit} className={classes.form} noValidate>
          <TextField
            value={formik.values.email}
            onChange={formik.handleChange}
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email адрес"
            name="email"
            autoComplete="email"
            autoFocus
          />
          <TextField
            value={formik.values.password}
            onChange={formik.handleChange}
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Пароль"
            type="password"
            id="password"
            autoComplete="current-password"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}>
            Войти
          </Button>
          <Grid container>
            <Grid item xs>
              <Link href="#" variant="body2">
                Забыли пароль?
              </Link>
            </Grid>
            <Grid item>
              <Link to="/sign-up" variant="body2" component={RouterLink}>
                Нет аккаунта? Создать.
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  );
};

export default SignIn;
