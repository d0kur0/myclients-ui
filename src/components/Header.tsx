import React, { ChangeEvent, useEffect, useState } from "react";
import { useStoreon } from "storeon/react";
import { Events, State } from "../store";
import { Link } from "react-router-dom";
import {
  Assignment as AssignmentIcon,
  EventNote as EventNoteIcon,
  MoreHoriz as MoreIcon,
  Group as GroupIcon,
  ArrowBack as ArrowBackIcon,
  Search as SearchIcon,
  AccountCircle as AccountCircleIcon,
} from "@material-ui/icons";
import {
  Container,
  InputBase,
  Menu,
  MenuItem,
  IconButton,
  Typography,
  Toolbar,
  AppBar,
  Button,
} from "@material-ui/core";
import useHeaderStyles from "../styles/Header";
import { PageProps } from "../App";
import { useLocation } from "react-use";

const Header = ({ title, isNeedSearch }: PageProps) => {
  const classes = useHeaderStyles();
  const { dispatch, searchQuery } = useStoreon<State, Events>("searchQuery");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState<null | HTMLElement>(null);

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const location = useLocation();
  useEffect(() => setMobileMoreAnchorEl(null), [location]);

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) =>
    setAnchorEl(event.currentTarget || null);

  const handleMobileMenuClose = () => setMobileMoreAnchorEl(null);

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) =>
    setMobileMoreAnchorEl(event.currentTarget);

  const handleAccountExit = () => {
    dispatch("user/signOut");
    handleMenuClose();
  };

  const handleInputSearch = (event: ChangeEvent<HTMLInputElement>) => {
    dispatch("globalSearch/setQuery", event.currentTarget.value.toLowerCase() || "");
  };

  const menuId = "primary-search-account-menu";
  const renderMenu = (
    <Menu
      getContentAnchorEl={null}
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: "bottom", horizontal: "center" }}
      open={isMenuOpen}
      onClose={handleMenuClose}>
      <MenuItem onClick={handleAccountExit}>Выйти из аккаунта</MenuItem>
    </Menu>
  );

  const mobileMenuId = "primary-search-account-menu-mobile";
  const renderMobileMenu = (
    <Menu
      getContentAnchorEl={null}
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}>
      <MenuItem component={Link} to="/">
        <IconButton aria-label="show 11 new notifications" color="inherit">
          <EventNoteIcon />
        </IconButton>
        <p>Записи</p>
      </MenuItem>
      <MenuItem component={Link} to="/clients">
        <IconButton aria-label="show 11 new notifications" color="inherit">
          <GroupIcon />
        </IconButton>
        <p>Клиенты</p>
      </MenuItem>
      <MenuItem component={Link} to="/services">
        <IconButton aria-label="show 11 new notifications" color="inherit">
          <AssignmentIcon />
        </IconButton>
        <p>Услуги</p>
      </MenuItem>
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit">
          <AccountCircleIcon />
        </IconButton>
        <p>Профиль</p>
      </MenuItem>
    </Menu>
  );

  return (
    <div className={classes.grow}>
      <AppBar position="static">
        <Container maxWidth="lg">
          <Toolbar className={classes.appBar}>
            <IconButton
              onClick={() => window.history.back()}
              edge="start"
              className={classes.menuButton}
              color="inherit"
              aria-label="Go to previous page">
              <ArrowBackIcon />
            </IconButton>
            <Typography className={classes.title} variant="h6" noWrap>
              {title}
            </Typography>
            <div className={classes.grow} />
            {isNeedSearch && (
              <div className={classes.search}>
                <div className={classes.searchIcon}>
                  <SearchIcon />
                </div>
                <InputBase
                  placeholder="Поиск..."
                  classes={{
                    root: classes.inputRoot,
                    input: classes.inputInput,
                  }}
                  value={searchQuery}
                  onChange={handleInputSearch}
                  inputProps={{ "aria-label": "search" }}
                />
              </div>
            )}
            <div className={classes.sectionDesktop}>
              <Button
                className={classes.desktopIconLabel}
                component={Link}
                to="/"
                aria-label="open records"
                color="inherit">
                <EventNoteIcon className={classes.desktopIcon} />
                Записи
              </Button>
              <Button
                className={classes.desktopIconLabel}
                component={Link}
                to="/clients"
                aria-label="open clients"
                color="inherit">
                <GroupIcon className={classes.desktopIcon} />
                Клиенты
              </Button>
              <Button
                className={classes.desktopIconLabel}
                component={Link}
                to="/services"
                aria-label="open services"
                color="inherit">
                <AssignmentIcon className={classes.desktopIcon} />
                Услуги
              </Button>
              <IconButton
                edge="end"
                aria-label="account of current user"
                aria-controls={menuId}
                aria-haspopup="true"
                onClick={handleProfileMenuOpen}
                color="inherit">
                <AccountCircleIcon />
              </IconButton>
            </div>
            <div className={classes.sectionMobile}>
              <IconButton
                aria-label="show more"
                aria-controls={mobileMenuId}
                aria-haspopup="true"
                onClick={handleMobileMenuOpen}
                color="inherit">
                <MoreIcon />
              </IconButton>
            </div>
          </Toolbar>
        </Container>
      </AppBar>
      {renderMobileMenu}
      {renderMenu}
    </div>
  );
};

export default Header;
