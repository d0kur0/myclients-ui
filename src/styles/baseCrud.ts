import { makeStyles } from "@material-ui/core";

const useBaseCrudStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    position: "relative",
  },
  addButtonContainer: {
    marginBottom: theme.spacing(2),
    display: "flex",
    justifyContent: "flex-end",
  },
  addButtonContainerSpaceBetWeen: {
    marginBottom: theme.spacing(2),
    display: "flex",
    justifyContent: "space-between",
  },
  submitButtonWrapper: {
    margin: theme.spacing(3, 0, 2),
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  submitButtonProgress: {
    color: theme.palette.primary.main,
    position: "absolute",
  },
}));

export default useBaseCrudStyles;
