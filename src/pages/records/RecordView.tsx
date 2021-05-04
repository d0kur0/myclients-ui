import React, { useEffect, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
  ListSubheader,
  Typography,
} from "@material-ui/core";
import { Link } from "react-router-dom";
import useBaseCrudStyles from "../../styles/baseCrud";
import { useStoreon } from "storeon/react";
import { Events, State } from "../../store";
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  MonetizationOn as MonetizationOnIcon,
} from "@material-ui/icons";
import RecordsDatePicker from "../../components/RecordsDatePicker";
import { format } from "date-fns";

const RecordView = () => {
  const classes = useBaseCrudStyles();
  const [recordForDelete, setRecordForDelete] = useState(0);
  const { dispatch, recordsDate, records } = useStoreon<State, Events>(
    "recordsDate",
    "records"
  );

  useEffect(() => dispatch("records/fetch"), [recordsDate, dispatch]);

  const handleDeleteRecord = (clientID: number) => setRecordForDelete(clientID);
  const handleDeleteRecordAgree = () => {
    dispatch("records/removeRemote", recordForDelete);
    setRecordForDelete(0);
  };
  const handleDeleteRecordDisagree = () => setRecordForDelete(0);

  return (
    <Container maxWidth="sm">
      <Dialog
        open={Boolean(recordForDelete)}
        onClose={handleDeleteRecordDisagree}
        aria-labelledby="responsive-dialog-title">
        <DialogTitle id="responsive-dialog-title">Подтвердите действие</DialogTitle>
        <DialogContent>
          <DialogContentText>Отменить удаление будет невозможно.</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleDeleteRecordDisagree} color="secondary">
            Нет
          </Button>
          <Button onClick={handleDeleteRecordAgree} color="primary" autoFocus>
            Да, удалить
          </Button>
        </DialogActions>
      </Dialog>

      <div className={classes.addButtonContainerSpaceBetWeen}>
        <div className={classes.datePicker}>
          <RecordsDatePicker />
        </div>

        <Button component={Link} to="/records/create" variant="contained" color="primary">
          Создать
        </Button>
      </div>

      <Box borderRadius={5} className={classes.root}>
        <List
          subheader={
            <ListSubheader>Записи на выбранную дату ({records.length})</ListSubheader>
          }>
          {records.length === 0 && (
            <ListItem>
              <ListItemText primary="Записей нет" />
            </ListItem>
          )}

          {records.map((record, key) => (
            <React.Fragment key={key}>
              {key !== 0 && <Divider variant="inset" component="li" />}
              <ListItem>
                <ListItemAvatar>
                  <Avatar>
                    <MonetizationOnIcon />
                  </Avatar>
                </ListItemAvatar>

                <ListItemText
                  primary={`${record.client.firstName} ${
                    record.client.middleName
                  } (${format(new Date(record.date), "HH:mm")})`}
                  secondary={
                    <>
                      {record.services.map((service, key) => (
                        <Typography component="span" key={key}>
                          {service.name}
                        </Typography>
                      ))}

                      <Typography variant="body2">
                        Сумма: {record.services.reduce((acc, s) => acc + s.price, 0)} руб.
                      </Typography>
                    </>
                  }
                />
                <ListItemSecondaryAction>
                  <IconButton
                    component={Link}
                    to={`/records/update/${record.id}`}
                    edge="start"
                    aria-label="delete">
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    onClick={() => handleDeleteRecord(record.id)}
                    edge="end"
                    aria-label="delete">
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            </React.Fragment>
          ))}
        </List>
      </Box>
    </Container>
  );
};

export default RecordView;
