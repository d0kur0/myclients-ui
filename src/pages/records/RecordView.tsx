import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Paper,
  DialogContentText,
  DialogTitle,
  Divider,
  Container,
  IconButton,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  ListSubheader,
  Typography,
  Card,
  CardHeader,
} from "@material-ui/core";
import { Link } from "react-router-dom";
import useBaseCrudStyles from "../../styles/baseCrud";
import { useStoreon } from "storeon/react";
import { Events, State } from "../../store";
import { Delete as DeleteIcon, Edit as EditIcon } from "@material-ui/icons";
import RecordsDatePicker from "../../components/RecordsDatePicker";
import { format } from "date-fns";
import { useRecordViewStyles } from "../../styles/recordView";
import { Skeleton } from "@material-ui/lab";

const RecordView = () => {
  const classes = useBaseCrudStyles();
  const recordViewClasses = useRecordViewStyles();
  const [recordForDelete, setRecordForDelete] = useState(0);
  const { dispatch, recordsDate, records, isPending } = useStoreon<State, Events>(
    "recordsDate",
    "records",
    "isPending"
  );

  useEffect(() => dispatch("records/fetch"), [recordsDate, dispatch]);

  const handleDeleteRecord = (clientID: number) => setRecordForDelete(clientID);
  const handleDeleteRecordAgree = () => {
    dispatch("records/removeRemote", recordForDelete);
    setRecordForDelete(0);
  };
  const handleDeleteRecordDisagree = () => setRecordForDelete(0);

  return (
    <Container>
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
        <Button component={Link} to="/records/create" variant="contained" color="primary">
          Создать
        </Button>
      </div>

      <div className={recordViewClasses.root}>
        <div className={recordViewClasses.datePicker}>
          <Paper elevation={3}>
            <RecordsDatePicker />
          </Paper>
        </div>

        <div className={recordViewClasses.list}>
          <Box borderRadius={5} className={classes.root}>
            {isPending && (
              <Card>
                <CardHeader
                  avatar={
                    <Skeleton animation="wave" variant="circle" width={40} height={40} />
                  }
                  title={
                    <Skeleton
                      animation="wave"
                      height={10}
                      width="80%"
                      style={{ marginBottom: 6 }}
                    />
                  }
                  subheader={<Skeleton animation="wave" height={10} width="40%" />}
                />
                <Skeleton animation="wave" variant="rect" height={190} />
              </Card>
            )}

            {!isPending && (
              <List
                subheader={
                  <ListSubheader>
                    Записи на выбранную дату ({records.length})
                  </ListSubheader>
                }>
                {records.length === 0 && (
                  <ListItem>
                    <ListItemText primary="Записей нет" />
                  </ListItem>
                )}

                {records.map((record, key) => (
                  <React.Fragment key={key}>
                    {key !== 0 && <Divider variant="fullWidth" component="li" />}
                    <ListItem>
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

                            <Typography component="span" variant="body2">
                              Сумма:{" "}
                              {record.services.reduce((acc, s) => acc + s.price, 0)} руб.
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
            )}
          </Box>
        </div>
      </div>
    </Container>
  );
};

export default RecordView;
