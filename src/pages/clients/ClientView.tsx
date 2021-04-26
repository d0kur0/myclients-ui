import React, { useMemo, useState } from "react";
import { useStoreon } from "storeon/react";
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
} from "@material-ui/core";
import {
  Delete as DeleteIcon,
  PermIdentity as PermIdentityIcon,
  Edit as EditIcon,
} from "@material-ui/icons";
import useBaseCrudStyles from "../../styles/baseCrud";
import { Link } from "react-router-dom";
import { Events, State } from "../../store";

const ClientView = () => {
  const { dispatch, clients, searchQuery } = useStoreon<State, Events>(
    "clients",
    "searchQuery"
  );
  const [clientForDelete, setClientForDelete] = useState(0);
  const classes = useBaseCrudStyles();

  const clientsForList = useMemo(
    () =>
      searchQuery.length
        ? clients.filter(
            client =>
              client.firstName.toLowerCase().includes(searchQuery) ||
              client.description.toLowerCase().includes(searchQuery) ||
              client.middleName.toLowerCase().includes(searchQuery)
          )
        : clients,
    [clients, searchQuery]
  );

  const handleDeleteClient = (clientID: number) => setClientForDelete(clientID);
  const handleDeleteClientAgree = () => {
    dispatch("clients/removeRemote", clientForDelete);
    setClientForDelete(0);
  };
  const handleDeleteClientDisagree = () => setClientForDelete(0);

  return (
    <Container maxWidth="sm">
      <Dialog
        open={Boolean(clientForDelete)}
        onClose={handleDeleteClientDisagree}
        aria-labelledby="responsive-dialog-title">
        <DialogTitle id="responsive-dialog-title">Подтвердите действие</DialogTitle>
        <DialogContent>
          <DialogContentText>Отменить удаление будет невозможно.</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleDeleteClientDisagree} color="secondary">
            Нет
          </Button>
          <Button onClick={handleDeleteClientAgree} color="primary" autoFocus>
            Да, удалить
          </Button>
        </DialogActions>
      </Dialog>

      <div className={classes.addButtonContainer}>
        <Button component={Link} to="/clients/create" variant="contained" color="primary">
          Создать
        </Button>
      </div>
      <Box borderRadius={5} className={classes.root}>
        <List subheader={<ListSubheader>Список клиентов</ListSubheader>}>
          {clientsForList.length === 0 && (
            <ListItem>
              <ListItemText primary="Записей нет" />
            </ListItem>
          )}

          {clientsForList.map((client, key) => (
            <React.Fragment key={key}>
              {key !== 0 && <Divider variant="inset" component="li" />}
              <ListItem>
                <ListItemAvatar>
                  <Avatar>
                    <PermIdentityIcon />
                  </Avatar>
                </ListItemAvatar>

                <ListItemText
                  primary={`${client.firstName} ${client.middleName}`}
                  secondary={client.description}
                />
                <ListItemSecondaryAction>
                  <IconButton
                    component={Link}
                    to={`/clients/update/${client.id}`}
                    edge="start"
                    aria-label="delete">
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    onClick={() => handleDeleteClient(client.id)}
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

export default ClientView;
