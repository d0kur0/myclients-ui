import React, { useEffect, useMemo } from "react";
import useBaseCrudStyles from "../../styles/baseCrud";
import { useHistory, useParams } from "react-router-dom";
import { useStoreon } from "storeon/react";
import { Events, State } from "../../store";
import { useFormik } from "formik";
import { UpdateRecordRequest } from "../../Api";
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

type ParamType = {
  recordID: string;
};

const RecordUpdate = () => {
  const classes = useBaseCrudStyles();
  const history = useHistory();

  const { dispatch, isPending, isSuccess, services, clients, records } = useStoreon<
    State,
    Events
  >("isPending", "isSuccess", "services", "clients", "records");

  const { recordID } = useParams<ParamType>();
  const record = useMemo(() => records.find(record => record.id === +recordID), [
    records,
    recordID,
  ]);

  const formik = useFormik<UpdateRecordRequest>({
    enableReinitialize: true,
    initialValues: {
      id: record?.id || 0,
      clientId: record?.clientId || 0,
      serviceIds: record?.services.map(s => s.id) || [],
      date: record?.date || new Date().toString(),
    },
    onSubmit: values => dispatch("records/updateRemote", values),
  });

  useEffect(() => {
    isSuccess && history.push("/");
  }, [isSuccess, history]);

  const Form = () => {
    return (
      <>
        <Typography component="h1" variant="h6">
          Обновление записи
        </Typography>
        <form onSubmit={formik.handleSubmit}>
          <MuiPickersUtilsProvider utils={DateFnsUtils} locale={ruLocale}>
            <KeyboardDateTimePicker
              fullWidth
              margin="normal"
              onChange={date => formik.setFieldValue("date", date)}
              label="Выберите время записи"
              initialFocusedDate={new Date()}
              value={formik.values.date}
              variant="inline"
              inputVariant="outlined"
              ampm={false}
              onError={(a, b) => {
                console.log("a:", a);
                console.log("b:", b);
              }}
            />
          </MuiPickersUtilsProvider>

          <Autocomplete
            id="client"
            options={clients}
            getOptionSelected={(option, value) => option.id === value.id}
            getOptionLabel={client => `${client.firstName} ${client.middleName}`}
            value={record?.client}
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
            getOptionSelected={(option, value) => option.id === value.id}
            getOptionLabel={service => `${service.name} (${service.price} руб.)`}
            value={record?.services}
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
              Изменить
            </Button>
            {isPending && (
              <CircularProgress size={24} className={classes.submitButtonProgress} />
            )}
          </span>
        </form>
      </>
    );
  };

  return (
    <Container maxWidth="sm">
      <Box boxShadow={3} padding="15px" borderRadius={5} className={classes.root}>
        {record ? <Form /> : "Loading..."}
      </Box>
    </Container>
  );
};

export default RecordUpdate;
