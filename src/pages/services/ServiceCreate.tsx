import React, { useEffect } from "react";
import { Box, Button, CircularProgress, Container, TextField } from "@material-ui/core";
import useBaseCrudStyles from "../../styles/baseCrud";
import Typography from "@material-ui/core/Typography";
import { useFormik } from "formik";
import { CreateServiceRequest } from "../../Api";
import { useStoreon } from "storeon/react";
import { Events, State } from "../../store";
import { useHistory } from "react-router-dom";

const ServiceCreate = () => {
  const classes = useBaseCrudStyles();
  const history = useHistory();

  const { dispatch, isPending, isSuccess } = useStoreon<State, Events>(
    "isPending",
    "isSuccess"
  );

  const formik = useFormik<CreateServiceRequest>({
    initialValues: {
      name: "",
      price: 0,
    },
    onSubmit: values => dispatch("services/createRemote", values),
  });

  useEffect(() => {
    isSuccess && history.push("/services");
  }, [isSuccess, history]);

  return (
    <Container maxWidth="sm">
      <Box boxShadow={3} padding="15px" borderRadius={5} className={classes.root}>
        <Typography component="h1" variant="h6">
          Добавление услуги
        </Typography>
        <form onSubmit={formik.handleSubmit}>
          <TextField
            value={formik.values.name}
            onChange={formik.handleChange}
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="name"
            label="Название услуги"
            name="name"
            autoComplete="name"
            autoFocus
          />
          <TextField
            value={formik.values.price}
            onChange={formik.handleChange}
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="price"
            label="Стоимость услуги"
            name="price"
            type="number"
            autoComplete="price"
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

export default ServiceCreate;
