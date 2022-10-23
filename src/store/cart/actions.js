import { useGlobalVariable } from "../index";
import { useRequest } from "../request";

export default {
  addProduct(product) {
    const snackbar = useGlobalVariable();
    const indexNumber = this.products.findIndex(
      (item) => item.id === product.id
    );
    if (
      indexNumber === -1 ||
      this.products[indexNumber].store > this.products[indexNumber].qty
    ) {
      if (indexNumber === -1) {
        this.products.push(product);
      } else {
        this.products[indexNumber].qty++;
      }
      snackbar.openSnackbar({
        status: "success",
        message: "محصول با موفقیت به سبد شما اضافه شد",
      });
      this.updateStorage();
    } else {
      snackbar.openSnackbar({
        status: "error",
        message: "محصول موجود نیست",
      });
    }
  },
  increaseQty(id) {
    const snackbar = useGlobalVariable();
    const indexNumber = this.products.findIndex((product) => product.id === id);
    if (
      indexNumber === -1 ||
      this.products[indexNumber].store > this.products[indexNumber].qty
    ) {
      this.products[indexNumber].qty++;
      this.updateStorage();
    } else {
      snackbar.openSnackbar({
        status: "error",
        message: "محصول موجود نیست",
      });
    }
  },

  decreaseQty(id) {
    const index = this.products.findIndex((product) => product.id === id);
    this.products[index].qty--;
    this.updateStorage();
  },

  removeItem(id) {
    this.products = this.products.filter((product) => product.id !== id);
    this.updateStorage();
  },
  updateStorage() {
    localStorage.setItem("cart", JSON.stringify(this.products));
  },
  async getAddresses() {
    const request = useRequest();
    request.fetchData({
      url: "/user/profile/",
    }).then((result) => {
      this.addresses = result.addresses;
    });
  },
};
