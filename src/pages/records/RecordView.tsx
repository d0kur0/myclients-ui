import React, { ChangeEvent, useEffect } from "react";
import { Button, Container, Paper, TextField, Typography } from "@material-ui/core";
import { Link } from "react-router-dom";
import useBaseCrudStyles from "../../styles/baseCrud";
import { useStoreon } from "storeon/react";
import { Events, State } from "../../store";

const RecordView = () => {
  const classes = useBaseCrudStyles();
  const { dispatch, recordsDate, records } = useStoreon<State, Events>(
    "recordsDate",
    "records"
  );

  useEffect(() => dispatch("records/fetch"), [recordsDate]);

  const handleChangeRecordsDate = (event: ChangeEvent<HTMLInputElement>) => {
    const [year, month, day] = event.currentTarget.value.split("-");
    dispatch("records/setRecordsDate", { year, day, month });
  };

  return (
    <Container maxWidth="sm">
      <div className={classes.addButtonContainerSpaceBetWeen}>
        <TextField
          onChange={handleChangeRecordsDate}
          id="date"
          label="Выберите день"
          type="date"
          defaultValue={`${recordsDate.year}-${recordsDate.month}-${recordsDate.day}`}
          InputLabelProps={{
            shrink: true,
          }}
        />

        <Button component={Link} to="/records/create" variant="contained" color="primary">
          Создать
        </Button>
      </div>

      {records.map(record => (
        <div>
          {record.id}
          <br />
          {record.client.firstName}
        </div>
      ))}
    </Container>
  );
};

export default RecordView;
