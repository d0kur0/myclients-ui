import React, { useEffect } from "react";
import useBaseCrudStyles from "../../styles/baseCrud";
import { useHistory } from "react-router-dom";
import { useStoreon } from "storeon/react";
import { Events, State } from "../../store";
import { useFormik } from "formik";
import { CreateRecordRequest } from "../../Api";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  TextField,
  Typography,
} from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import { KeyboardDateTimePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import ruLocale from "date-fns/locale/ru";
import { Service } from "../../store/services";
import { Client } from "../../store/clients";

const RecordCreate = () => {
  const classes = useBaseCrudStyles();
  const history = useHistory();

  const { dispatch, isPending, isSuccess, services, clients } = useStoreon<State, Events>(
    "isPending",
    "isSuccess",
    "services",
    "clients"
  );

  const formik = useFormik<CreateRecordRequest>({
    initialValues: {
      clientId: 0,
      serviceIds: [],
      date: new Date().toDateString(),
    },
    onSubmit: values => dispatch("records/createRemote", values),
  });

  useEffect(() => {
    isSuccess && history.push("/");
  }, [isSuccess, history]);

  return (
    <Container maxWidth="sm">
      <Box boxShadow={3} padding="15px" borderRadius={5} className={classes.root}>
        <Typography component="h1" variant="h6">
          Добавление записи
        </Typography>
        <form onSubmit={formik.handleSubmit}>
          <MuiPickersUtilsProvider utils={DateFnsUtils} locale={ruLocale}>
            <KeyboardDateTimePicker
              fullWidth
              margin="normal"
              onChange={date => formik.setFieldValue("date", date)}
              label="Выберите время записи"
              minDate={new Date()}
              value={formik.values.date}
              variant="inline"
              inputVariant="outlined"
              ampm={false}
            />
          </MuiPickersUtilsProvider>

          <Autocomplete
            id="client"
            options={clients}
            getOptionLabel={client => `${client.firstName} ${client.middleName}`}
            defaultValue={null}
            onChange={(event, client: Client | null) =>
              client && formik.setFieldValue("clientId", client.id)
            }
            renderInput={params => (
              <TextField
                {...params}
                fullWidth
                required
                margin="normal"
                variant="outlined"
                label="Выберите клиента"
                placeholder="Денежный мешок"
              />
            )}
          />

          <Autocomplete
            onChange={(event, values: Service[]) =>
              formik.setFieldValue(
                "serviceIds",
                values.map(c => c.id)
              )
            }
            id="services"
            multiple
            options={services}
            getOptionLabel={service => `${service.name} (${service.price} руб.)`}
            defaultValue={[]}
            renderInput={params => (
              <TextField
                {...params}
                fullWidth
                margin="normal"
                variant="outlined"
                label="Выберите услуги"
                placeholder="Наращивание"
              />
            )}
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

export default RecordCreate;
