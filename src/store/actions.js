export default {
  openSnackbar({ message = "something went wrong ...", status = "error" }) {
    this.closeSnackbar();
    this.snackbar = true;
    this.snackbarMessage = message;
    this.snackbarStatus = status;
    setTimeout(() => (this.snackbar = false), 2500);
  },
  closeSnackbar() {
    this.snackbar = false;
  },
  toggleLoginStatus() {
    this.isLoggedIn = !this.isLoggedIn;
  },
};
