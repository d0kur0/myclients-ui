import React, { useEffect, useMemo } from "react";
import { Box, Button, CircularProgress, Container, TextField } from "@material-ui/core";
import useBaseCrudStyles from "../../styles/baseCrud";
import Typography from "@material-ui/core/Typography";
import { useFormik } from "formik";
import { UpdateServiceRequest } from "../../Api";
import { useStoreon } from "storeon/react";
import { Events, State } from "../../store";
import { useHistory } from "react-router-dom";
import { useParams } from "react-router-dom";

type ParamType = {
  serviceID: string;
};

const ServiceUpdate = () => {
  const { dispatch, isPending, isSuccess, services } = useStoreon<State, Events>(
    "isPending",
    "isSuccess",
    "services"
  );

  const classes = useBaseCrudStyles();
  const history = useHistory();
  const { serviceID } = useParams<ParamType>();
  const service = useMemo(
    () => services.filter(service => service.id === +serviceID)?.[0],
    [services, serviceID]
  );

  const formik = useFormik<UpdateServiceRequest>({
    enableReinitialize: true,
    initialValues: {
      id: service?.id,
      name: service?.name,
      price: service?.price,
    },
    onSubmit: values => dispatch("services/updateRemote", values),
  });

  useEffect(() => {
    isSuccess && history.push("/services");
  }, [isSuccess, history]);

  return (
    <Container maxWidth="sm">
      <Box boxShadow={3} padding="15px" borderRadius={5} className={classes.root}>
        <Typography component="h1" variant="h6">
          Редактирование услуги
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
            autoComplete="price"
          />
          <span className={classes.submitButtonWrapper}>
            <Button
              disabled={isPending}
              type="submit"
              variant="contained"
              color="primary">
              Изменить
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

export default ServiceUpdate;
