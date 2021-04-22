import { makeStyles } from "@material-ui/core/styles";

const useErrorAlertStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    flexDirection: "column",
  },
  alert: {
    marginBottom: theme.spacing(2),
  },
}));

export default useErrorAlertStyles;
