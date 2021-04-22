import React, { useEffect } from "react";
import { Box, Button, CircularProgress, Container, TextField } from "@material-ui/core";
import useBaseCrudStyles from "../../styles/baseCrud";
import Typography from "@material-ui/core/Typography";
import { useFormik } from "formik";
import { CreateClientRequest } from "../../Api";
import { useStoreon } from "storeon/react";
import { Events, State } from "../../store";
import { useHistory } from "react-router-dom";

const ClientCreate = () => {
  const classes = useBaseCrudStyles();
  const history = useHistory();

  const { dispatch, isPending, isSuccess } = useStoreon<State, Events>(
    "isPending",
    "isSuccess"
  );

  const formik = useFormik<CreateClientRequest>({
    initialValues: {
      firstName: "",
      middleName: "",
      description: "",
    },
    onSubmit: values => dispatch("clients/createRemote", values),
  });

  useEffect(() => {
    isSuccess && history.push("/clients");
  }, [isSuccess, history]);

  return (
    <Container maxWidth="sm">
      <Box boxShadow={3} padding="15px" borderRadius={5} className={classes.root}>
        <Typography component="h1" variant="h6">
          Добавление клиента
        </Typography>
        <form onSubmit={formik.handleSubmit}>
          <TextField
            value={formik.values.firstName}
            onChange={formik.handleChange}
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="firstName"
            label="Имя клиента"
            name="firstName"
            autoComplete="firstName"
            autoFocus
          />
          <TextField
            value={formik.values.middleName}
            onChange={formik.handleChange}
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="middleName"
            label="Фамилия клиента"
            name="middleName"
            autoComplete="middleName"
          />
          <TextField
            value={formik.values.description}
            onChange={formik.handleChange}
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="description"
            label="Описание клиента"
            name="description"
            autoComplete="description"
            multiline
          />
          <span className={classes.submitButtonWrapper}>
            <Button
              disabled={isPending}
              type="submit"
              variant="contained"
              color="primary">
              Создать
            </Button>
            {isPending && (
              <CircularProgress size={24} className={classes.submitButtonProgress} />
            )}
          </span>
        </form>
      </Box>
    </Container>
  );
};

export default ClientCreate;
