import React, { useEffect } from "react";
import { useStoreon } from "storeon/react";
import { useHistory, Link as RouterLink } from "react-router-dom";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import { useFormik } from "formik";
import { SignUpRequest } from "../Api";
import { Events, State } from "../store";
import useSignPagesStyles from "../styles/SignPages";

const SignUp = () => {
  const { dispatch, isAuth } = useStoreon<State, Events>("isAuth");
  const classes = useSignPagesStyles();
  const history = useHistory();
  const formik = useFormik<SignUpRequest>({
    initialValues: {
      name: "",
      email: "",
      password: "",
    },
    onSubmit: values => dispatch("user/signUp", values),
  });

  useEffect(() => {
    isAuth && history.push("/");
  }, [isAuth, history]);

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Авторизация
        </Typography>
        <form onSubmit={formik.handleSubmit} className={classes.form}>
          <TextField
            value={formik.values.name}
            onChange={formik.handleChange}
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="name"
            label="Ваше имя"
            name="name"
            autoComplete="name"
            autoFocus
          />
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
            Регистрация
          </Button>
          <Grid container>
            <Grid item xs />
            <Grid item>
              <Link to="/sign-in" variant="body2" component={RouterLink}>
                Перейти к авторизации
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  );
};

export default SignUp;
