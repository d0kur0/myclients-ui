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

const ServiceView = () => {
  const { dispatch, services, searchQuery } = useStoreon<State, Events>(
    "services",
    "searchQuery"
  );
  const [serviceForDelete, setServiceForDelete] = useState(0);
  const classes = useBaseCrudStyles();

  console.log(services);

  const servicesForList = useMemo(
    () =>
      searchQuery.length
        ? services.filter(service => service.name.toLowerCase().includes(searchQuery))
        : services,
    [services, searchQuery]
  );

  const handleDeleteService = (clientID: number) => setServiceForDelete(clientID);
  const handleDeleteServiceAgree = () => {
    dispatch("services/removeRemote", serviceForDelete);
    setServiceForDelete(0);
  };
  const handleDeleteServiceDisagree = () => setServiceForDelete(0);

  return (
    <Container maxWidth="sm">
      <Dialog
        open={Boolean(serviceForDelete)}
        onClose={handleDeleteServiceDisagree}
        aria-labelledby="responsive-dialog-title">
        <DialogTitle id="responsive-dialog-title">Подтвердите действие</DialogTitle>
        <DialogContent>
          <DialogContentText>Отменить удаление будет невозможно.</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleDeleteServiceDisagree} color="secondary">
            Нет
          </Button>
          <Button onClick={handleDeleteServiceAgree} color="primary" autoFocus>
            Да, удалить
          </Button>
        </DialogActions>
      </Dialog>

      <div className={classes.addButtonContainer}>
        <Button
          component={Link}
          to="/services/create"
          variant="contained"
          color="primary">
          Создать
        </Button>
      </div>
      <Box borderRadius={5} className={classes.root}>
        <List subheader={<ListSubheader>Список услуг</ListSubheader>} dense={true}>
          {servicesForList.length === 0 && (
            <ListItem>
              <ListItemText primary="Записей нет" />
            </ListItem>
          )}

          {servicesForList.map((service, key) => (
            <React.Fragment key={key}>
              {key !== 0 && <Divider variant="inset" component="li" />}
              <ListItem>
                <ListItemAvatar>
                  <Avatar>
                    <PermIdentityIcon />
                  </Avatar>
                </ListItemAvatar>

                <ListItemText primary={service.name} secondary={service.price} />
                <ListItemSecondaryAction>
                  <IconButton
                    component={Link}
                    to={`/services/update/${service.id}`}
                    edge="start"
                    aria-label="delete">
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    onClick={() => handleDeleteService(service.id)}
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

export default ServiceView;
