import { makeStyles } from "@material-ui/core/styles";

export const useRecordViewStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
  },
  datePicker: {
    margin: theme.spacing(1),
    [theme.breakpoints.down("xs")]: {
      margin: theme.spacing(0),
      marginBottom: theme.spacing(2),
      flexGrow: 1,
    },
  },
  list: {
    margin: theme.spacing(1),
    flexGrow: 1,
    [theme.breakpoints.down("xs")]: {
      margin: theme.spacing(0),
    },
  },
}));
